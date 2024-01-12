import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Game, GameConfig, Player, Round } from '../types'
import { getCurrentRound } from '../utils/game'
import { generateClient } from 'aws-amplify/api'
import { updateGame } from '@/graphql/mutations'
import { getGameConfig } from '../data/game-configs'
import { getPlayerById } from '../utils/player'
import { gameReducer } from '../reducers/gameReducer'

const client = generateClient()

interface GameContextValue {
  gameState: Game
  dispatch: any
  currentRound: Round | null
  game: Game
  gameConfig: GameConfig
  myPlayer: Player | null
  isMyTurn: () => boolean
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
  playerId,
  initialGame,
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGame)

  const [myPlayer, setMyPlayer] = useState<Player | null>(null)
  const [game, setGame] = useState<Game>(initialGame)
  const [gameConfig, setGameConfig] = useState<GameConfig>(getGameConfig())

  const currentRound = getCurrentRound(game)

  const isMyTurn = () => {
    if (game && playerId !== null) {
      return game.playerTurn === playerId
    }

    return false
  }

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
    if (playerId) {
      setMyPlayer(getPlayerById(game, playerId))
    }
  }, [game, playerId])

  useEffect(() => {
    if (game) {
      setGameConfig(getGameConfig(game.gameType))
    }
  }, [game])

  return (
    <GameContext.Provider
      value={{
        gameState,
        dispatch,
        currentRound,
        game,
        gameConfig,
        myPlayer,
        isMyTurn,
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
