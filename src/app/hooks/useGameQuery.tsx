import { GetGameQueryVariables } from '@/API'
import { getGame } from '@/graphql/queries'
import { generateClient } from 'aws-amplify/api'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GameTypes } from '../data/game-configs'
import { Game } from '../types'
import { onUpdateGame } from '@/graphql/subscriptions'
import { reduceGameData } from '../reducers/gameReducer'

const useGameQuery = (code: string, gameType: GameTypes) => {
  const searchParams = useSearchParams()

  const [game, setGame] = useState<Game>({
    id: '',
    code: '',
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
    if (gameData && game) {
      const parsedGame = reduceGameData(gameData)

      if (parsedGame) {
        // parsedGame.players.forEach((player) => {
        //   if (player.id === playerId) {
        //     const sortedCards = sortPlayerCards(game, player)
        //     player.cards = sortedCards
        //   }
        // })

        setGame(parsedGame)
      }
    }
  }, [gameData])

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

  return {
    game,
  }
}

export default useGameQuery
