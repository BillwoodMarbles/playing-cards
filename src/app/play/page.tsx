'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateClient } from 'aws-amplify/api'
import { onUpdateGame } from '@/graphql/subscriptions'
import { getGame } from '@/graphql/queries'
import { GetGameQueryVariables } from '@/API'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../../amplifyconfiguration.json'
import { Card, Game, GameStatus } from '../../types/types'
import '@/styles/animations.css'
import { sortPlayerCards } from '@/utils/player'
import { GameContextProvider } from '@/contexts/GameContext'
import GamePage from './Game'
import { PlayerContextProvider } from '@/contexts/PlayerContext'
import { GameTypes } from '@/data/game-configs'

const client = generateClient()
Amplify.configure(amplifyconfig)

export default function Play() {
  const [playerId, setPlayerId] = useState('')
  const [game, setGame] = useState<Game>({
    id: '',
    code: '',
    players: [],
    gameType: GameTypes.FREE_PLAY,
    rounds: [],
    deck: [],
    discardDeck: [],
    playerTurn: '',
    status: 'open',
    currentRound: 0,
    lastMove: null,
    mode: 'online',
  })
  const searchParams = useSearchParams()
  const [gameData, setGameData] = useState<any>(null)

  const reduceGameData = (gameData: any) => {
    if (gameData) {
      const parsedGame: Game = {
        id: gameData.id,
        code: gameData.code,
        status: gameData.status as GameStatus,
        playerTurn: gameData.playerTurn || 0,
        deck: gameData.deck ? JSON.parse(gameData.deck) : [],
        discardDeck: gameData.discardDeck
          ? JSON.parse(gameData.discardDeck)
          : [],
        players: gameData.players ? JSON.parse(gameData.players) : [],
        rounds: gameData.rounds ? JSON.parse(gameData.rounds) : [],
        currentRound: gameData.currentRound || 0,
        gameType: gameData.gameType || 'standard',
        mode: gameData.mode || 'online',
        lastMove: gameData.lastMove
          ? JSON.parse(gameData.lastMove)
          : {
              playerId: '',
              action: '',
              card: null,
            },
      }

      // remove null player cards
      parsedGame.players.forEach((player) => {
        player.cards = player.cards.filter((card: Card) => card !== null)
      })

      return parsedGame
    }

    return null
  }

  const subscribeToGameUpdates = (code: string) => {
    let subscription: any
    try {
      subscription = client
        .graphql({
          query: onUpdateGame,
          variables: {
            filter: {
              id: { eq: code },
            },
          },
        })
        .subscribe({
          next: (eventData: any) => {
            if (eventData.data) {
              setGameData(eventData.data.onUpdateGame)
            }
          },
        })
    } catch (err) {
      console.error('error subscribing to game updates', err)
    }

    return subscription
  }

  useEffect(() => {
    if (gameData && game) {
      const parsedGame = reduceGameData(gameData)

      if (parsedGame) {
        parsedGame.players.forEach((player) => {
          if (player.id === playerId) {
            const sortedCards = sortPlayerCards(game, player)
            player.cards = sortedCards
          }
        })

        setGame(parsedGame)
      }
    }
  }, [gameData])

  const getGameByCode = async (code: string) => {
    try {
      const gameData = await client.graphql({
        query: getGame,
        variables: {
          id: code,
        } as GetGameQueryVariables,
      })

      if (gameData.data) {
        setGameData(gameData.data.getGame)
      } else {
        console.error('no game data available')
      }
    } catch (err) {
      console.error('error Getting game', err)
    }
  }

  useEffect(() => {
    const playerId = searchParams.get('playerId')

    if (playerId) {
      setPlayerId(playerId)
    }
  }, [searchParams])

  useEffect(() => {
    const code = searchParams.get('code')
    const localGame = JSON.parse(localStorage.getItem('game') || '{}')

    let subscription: any

    if (localGame && localGame.mode === 'local') {
      setGame(localGame)
    } else if (code) {
      getGameByCode(code)
      subscription = subscribeToGameUpdates(code)
    }

    if (subscription) {
      return () => subscription.unsubscribe()
    }
  }, [])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <GameContextProvider playerId={playerId} initialGame={game}>
      <PlayerContextProvider playerId={playerId}>
        <GamePage />
      </PlayerContextProvider>
    </GameContextProvider>
  )
}
