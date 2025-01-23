import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Game, GameConfig, Round } from '@/types/types'
import { getCurrentRound } from '@/utils/game'
import { generateClient } from 'aws-amplify/api'
import { updateGame } from '@/graphql/mutations'
import { getGameConfig } from '@/data/game-configs'

const client = generateClient()

interface GameContextValue {
  currentRound: Round | null
  game: Game
  gameConfig: GameConfig
  updateGameState: (game: Game, skipDataSync?: boolean) => void
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

interface GameContextProps {
  initialGame: Game
  playerId?: string
  children: React.ReactNode
}

export const GameContextProvider: FC<GameContextProps> = ({
  children,
  initialGame,
}) => {
  const [game, setGame] = useState<Game>(initialGame)
  const [gameConfig, setGameConfig] = useState<GameConfig>(getGameConfig())

  const currentRound = getCurrentRound(game)

  const updateGameGQL = async (game: Game) => {
    try {
      await client.graphql({
        query: updateGame,
        variables: {
          input: {
            id: game.id,
            code: game.code,
            players: JSON.stringify(game.players),
            deck: JSON.stringify(game.deck),
            discardDeck: JSON.stringify(game.discardDeck),
            playerTurn: game.playerTurn,
            status: game.status,
            rounds: JSON.stringify(game.rounds),
            currentRound: game.currentRound,
            lastMove: JSON.stringify(game.lastMove),
          },
        },
      })
    } catch (err) {
      console.error('error updating game', err)
    }
  }

  const updateGameState = (
    updatedData: Partial<Game>,
    skipDataSync?: boolean
  ) => {
    const newGame = { ...game, ...updatedData }

    if (newGame.mode === 'online' && !skipDataSync) {
      updateGameGQL(newGame)
    }

    localStorage.setItem('game', JSON.stringify(newGame))
    setGame(newGame)
  }

  useEffect(() => {
    if (initialGame) {
      setGame(initialGame)
    }
  }, [initialGame])

  useEffect(() => {
    if (game) {
      setGameConfig(getGameConfig(game.gameType))
    }
  }, [game])

  return (
    <GameContext.Provider
      value={{
        currentRound,
        game,
        gameConfig,
        updateGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  const context = useContext(GameContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
