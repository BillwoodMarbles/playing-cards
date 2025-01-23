import React, { FC, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Game, GameMode } from '@/types/types'
import { v4 as UUID } from 'uuid'
import { GameTypes, getGameConfig } from '@/data/game-configs'
import { generateClient } from 'aws-amplify/api'
import { createGame } from '@/graphql/mutations'
import { CreateGameInput } from '@/API'

const client = generateClient()

interface ConfigureGameFormProps {
  gameType: GameTypes
}

const ConfigureGameForm: FC<ConfigureGameFormProps> = ({ gameType }) => {
  const router = useRouter()
  const pathname = usePathname()

  const gameConfig = getGameConfig(gameType)

  const [playerName, setPlayerName] = useState('')
  const [gameMode, setGameMode] = useState<GameMode>('online')
  const [roundCount, setRoundCount] = useState(
    gameConfig.rounds.length.toString()
  )

  const handleCreateGame = async (e: any) => {
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
      } catch (err) {
        console.error('error creating game')
      }
    }

    localStorage.setItem('playerId', newGame.players[0].id)
    localStorage.setItem('game', JSON.stringify(newGame))

    router.push(
      `${pathname}?code=${newGame.code}&playerId=${newGame.players[0].id}`
    )
  }

  return (
    <form onSubmit={handleCreateGame}>
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
            <option value="" disabled defaultValue="online">
              Game Mode
            </option>
            <option value="online">Online</option>
            <option value="local">Local</option>
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
        className="rounded-md bg-blue-300 px-6 py-2"
      >
        Create Game
      </button>
    </form>
  )
}

export default ConfigureGameForm
