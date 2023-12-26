'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { generateClient } from 'aws-amplify/api'
import { createGame } from '@/graphql/mutations'
import { CreateGameInput } from '@/API'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'
import { GameTypes, getGameConfig } from './data/game-configs'
import { v4 as UUID } from 'uuid'
import { Game, GameMode } from './types'

Amplify.configure(amplifyconfig)
const client = generateClient()

export default function Home() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('')
  const [gameMode, setGameMode] = useState<GameMode>('online')
  const [gameType, setGameType] = useState<GameTypes>(GameTypes.GRANDMA)
  const [roundCount, setRoundCount] = useState(
    getGameConfig(gameType).rounds.length.toString()
  )

  const onCreateGame = async (e: any) => {
    e.preventDefault()
    const code = Math.random().toString(36).substring(2, 6)

    const newGame: Game = {
      id: code,
      code,
      players: [
        { id: UUID(), name: playerName, cards: [], type: 'host', score: 0 },
      ],
      gameType,
      rounds: [],
      deck: [],
      discardDeck: [],
      playerTurn: '',
      status: 'open',
      currentRound: 0,
      lastMove: null,
      mode: gameMode,
    }

    if (roundCount) {
      newGame.rounds = getGameConfig(gameType).rounds.slice(
        0,
        parseInt(roundCount)
      )
    }

    if (newGame.mode === 'online') {
      try {
        await client.graphql({
          query: createGame,
          variables: {
            input: {
              id: newGame.code,
              code: newGame.code,
              players: JSON.stringify(newGame.players),
              deck: JSON.stringify(newGame.deck),
              discardDeck: JSON.stringify(newGame.discardDeck),
              playerTurn: newGame.playerTurn,
              status: newGame.status,
              rounds: JSON.stringify(newGame.rounds),
              currentRound: newGame.currentRound,
              gameType: newGame.gameType,
            } as CreateGameInput,
          },
        })

        localStorage.setItem('playerId', newGame.players[0].id)
        localStorage.setItem('game', JSON.stringify(newGame))

        if (newGame.gameType === GameTypes.CARD_PARTY) {
          router.push(
            `/games/card-party?code=${code}&playerId=${newGame.players[0].id}`
          )
        } else {
          router.push(`/play?code=${code}&playerId=${newGame.players[0].id}`)
        }
      } catch (err) {
        console.error('error creating game')
      }
    }

    if (newGame.mode === 'local') {
      localStorage.setItem('game', JSON.stringify(newGame))

      if (newGame.gameType === GameTypes.CARD_PARTY) {
        router.push(
          `/games/card-party?code=${code}&playerId=${newGame.players[0].id}`
        )
      } else {
        router.push(`/play?code=${code}&playerId=${newGame.players[0].id}`)
      }
    }
  }

  const changeGameType = (gameTypeValue: string) => {
    const gameType = gameTypeValue as GameTypes
    setGameType(gameType)
    setRoundCount(getGameConfig(gameType).rounds.length.toString())
  }

  return (
    <>
      <header className="flex w-full items-center justify-center py-2">
        <div className="flex items-center">
          <h1 className="text-2xl">Card Night</h1>
        </div>
      </header>

      <section className="w-full grow bg-slate-100 px-2 py-4 text-center">
        <div className="mx-auto max-w-xs">
          <form onSubmit={onCreateGame}>
            <div className="mb-4">
              <label>
                <input
                  className="w-full rounded-md border border-gray-400 px-3 py-2"
                  type="text"
                  value={playerName}
                  placeholder="Player Name"
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label>
                <select
                  className="w-full rounded-md border border-gray-400 px-3 py-2"
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value as GameMode)}
                >
                  <option value="" disabled selected>
                    Game Mode
                  </option>
                  <option value="online">Online</option>
                  <option value="local">Local</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label>
                <select
                  className="w-full rounded-md border border-gray-400 px-3 py-2"
                  value={gameType}
                  onChange={(e) => changeGameType(e.target.value)}
                >
                  <option value="" disabled selected>
                    Game Type
                  </option>
                  <option value={GameTypes.GRANDMA}>Grandma</option>
                  <option value={GameTypes.MINI_GOLF}>Mini Golf</option>
                  <option value={GameTypes.CARD_PARTY}>Card Party</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label>
                <input
                  className="w-full rounded-md border border-gray-400 px-3 py-2"
                  type="number"
                  value={roundCount}
                  placeholder="Rounds"
                  onChange={(e) => setRoundCount(e.target.value)}
                />
              </label>
            </div>
            <button
              disabled={playerName.length === 0}
              type="submit"
              className="mb-5 rounded-md bg-blue-300 px-6 py-2"
              onClick={onCreateGame}
            >
              Create Game
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
