import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { PLAYER_ACTION, Player, PlayerAction } from '../types'
import { getNextAction } from '../utils/actions'
import { useGameContext } from './GameContext'
import { getPlayerById } from '../utils/player'

interface PlayerContextValue {
  currentAction: PlayerAction | null
  playerActions: PlayerAction[]
  myPlayer: Player | null
  isMyTurn: () => boolean
  resetActions: () => void
  completeAction: (action: PLAYER_ACTION) => void
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

interface PlayerContextProps {
  children: React.ReactNode
  playerId: string
}

export const PlayerContextProvider: FC<PlayerContextProps> = ({
  children,
  playerId,
}) => {
  const { game } = useGameContext()

  const [myPlayer, setMyPlayer] = useState<Player | null>(null)
  const [playerActions, setPlayerActions] = useState<PlayerAction[]>([])
  const [currentAction, setCurrentAction] = useState<PlayerAction | null>(null)

  const completeAction = (actionTaken: PLAYER_ACTION) => {
    if (!currentAction) {
      return
    }
    const completedAction = { ...currentAction }
    completedAction.actionTaken = actionTaken

    localStorage.setItem(
      'playerActions',
      JSON.stringify([...playerActions, completedAction])
    )
    setPlayerActions((prevValue) => [...prevValue, completedAction])
  }

  const resetActions = () => {
    setPlayerActions([])
    localStorage.setItem('playerActions', JSON.stringify([]))
  }

  const isMyTurn = () => {
    if (game && playerId !== null) {
      return game.playerTurn === playerId
    }

    return false
  }

  useEffect(() => {
    if (playerId) {
      setMyPlayer(getPlayerById(game, playerId))
    }
  }, [game, playerId])

  useEffect(() => {
    const _currentAction = getNextAction(game, playerActions, playerId)
    setCurrentAction(_currentAction)
  }, [playerActions, game])

  useEffect(() => {
    const localPlayerActions = JSON.parse(
      localStorage.getItem('playerActions') || '[]'
    )

    setPlayerActions(localPlayerActions)
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        currentAction,
        playerActions,
        myPlayer,
        isMyTurn,
        resetActions,
        completeAction,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerContextProvider')
  }

  return context
}
