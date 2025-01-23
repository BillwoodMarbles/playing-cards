import { GetGameQueryVariables } from '@/API'
import { getGame } from '@/graphql/queries'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'
import { GameTypes } from '@/data/game-configs'
import { Game } from '@/types/types'
import { onUpdateGame } from '@/graphql/subscriptions'
import { reduceGameData } from '@/reducers/gameReducer'

const useGameQuery = (code: string, gameType: GameTypes) => {
  const [game, setGame] = useState<Game>({
    id: '',
    code: code,
    players: [],
    gameType: gameType,
    rounds: [],
    deck: [],
    discardDeck: [],
    playerTurn: '',
    status: 'open',
    currentRound: 0,
    lastMove: null,
    mode: 'local',
  })
  const [gameData, setGameData] = useState<any>(null)
  const client = generateClient()

  const subscribeToGameUpdates = () => {
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

  const getGameByCode = async () => {
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
    if (gameData && game) {
      const parsedGame = reduceGameData(gameData)

      if (parsedGame) {
        setGame(parsedGame)
      }
    }
  }, [gameData])

  useEffect(() => {
    let localGame
    if (code) {
      localGame = JSON.parse(localStorage.getItem('game') || '{}')
    } else {
      localStorage.removeItem('game')
    }

    let subscription: any

    if (
      code &&
      localGame &&
      localGame.mode === 'local' &&
      localGame.gameType === gameType
    ) {
      setGame(localGame)
    } else if (code) {
      getGameByCode()
      subscription = subscribeToGameUpdates()
    }

    if (subscription) {
      return () => subscription.unsubscribe()
    }
  }, [code])

  return {
    game,
  }
}

export default useGameQuery
