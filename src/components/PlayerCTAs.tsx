import React, { FC } from 'react'
import { useGameContext } from '@/contexts/GameContext'
import { usePlayerContext } from '@/contexts/PlayerContext'
import { PLAYER_ACTION } from '@/types/types'
import useGame from '@/hooks/useGame'

interface PlayerCTAsProps {}

const PlayerCTAs: FC<PlayerCTAsProps> = () => {
  const { game, currentRound, gameConfig, updateGameState } = useGameContext()
  const { currentAction, myPlayer, completeAction } = usePlayerContext()
  const {
    claimRound,
    endTurn,
    dealCardsToPlayers,
    startGame,
    newGame,
    initializeRound,
  } = useGame(game, myPlayer)

  const isLastRound = () => {
    return game.currentRound === game.rounds.length - 1
  }

  const actions: {
    show: boolean
    handle: () => void
    label: string
    className?: string
  }[] = [
    {
      show: Boolean(
        currentAction?.availableActions.includes(PLAYER_ACTION.CLAIM_ROUND)
      ),
      handle: () => {
        const newGame = claimRound()
        updateGameState(newGame)
        completeAction(PLAYER_ACTION.CLAIM_ROUND)
      },
      label: 'GRANDMA!!!',
      className: 'bg-red-300',
    },
    {
      show: Boolean(
        currentAction?.availableActions.includes(PLAYER_ACTION.END_TURN)
      ),
      handle: () => {
        try {
          const newGame = endTurn()
          updateGameState(newGame)
          completeAction(PLAYER_ACTION.CLAIM_ROUND)
        } catch (err) {
          console.error(err)
        }
      },
      label: 'End Turn',
    },
    {
      show:
        game.status === 'open' &&
        myPlayer?.type === 'host' &&
        game.players.length >= gameConfig.minPlayers,
      handle: () => {
        try {
          const newGame = startGame()
          updateGameState(newGame)
        } catch (err) {
          console.error('error starting game', err)
        }
      },
      label: 'Start Game',
    },
    {
      show:
        currentRound?.status === 'open' &&
        currentRound?.dealer === myPlayer?.id,
      handle: () => {
        const newGame = dealCardsToPlayers()
        updateGameState(newGame)
      },
      label: 'Deal',
    },
    {
      show:
        currentRound?.status === 'complete' &&
        !isLastRound() &&
        myPlayer?.type === 'host',
      handle: () => {
        const newGame = initializeRound()
        updateGameState(newGame)
      },
      label: 'Start New Round',
    },
    {
      show:
        myPlayer?.type === 'host' &&
        currentRound?.status === 'complete' &&
        isLastRound(),
      handle: () => {
        const game = newGame()
        updateGameState(game)
      },
      label: 'New Game',
    },
  ]

  return (
    <div className="flex justify-center">
      {actions.map(
        (action, index) =>
          action.show && (
            <button
              key={index}
              className={`mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md ${action.className}`}
              onClick={action.handle}
            >
              {action.label}
            </button>
          )
      )}
    </div>
  )
}

export default PlayerCTAs
