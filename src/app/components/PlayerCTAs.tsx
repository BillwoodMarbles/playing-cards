import React, { FC } from 'react'
import { useGame as GameContext } from '../contexts/GameContext'
import { usePlayer } from '../contexts/PlayerContext'
import { PLAYER_ACTION } from '../types'
import useGame from '../hooks/useGame'

interface PlayerCTAsProps {}

const PlayerCTAs: FC<PlayerCTAsProps> = () => {
  const { game, myPlayer, updateGameState } = GameContext()
  const { currentAction, completeAction } = usePlayer()
  const { claimRound, endTurn } = useGame(game, myPlayer)

  const showClaimRoundCTA = () => {
    return currentAction?.availableActions.includes(PLAYER_ACTION.CLAIM_ROUND)
  }

  const showEndTurnCTA = () => {
    return currentAction?.availableActions.includes(PLAYER_ACTION.END_TURN)
  }

  const roundClaimClick = () => {
    const newGame = claimRound()
    updateGameState(newGame)
    completeAction(PLAYER_ACTION.CLAIM_ROUND)
  }

  const endTurnClick = () => {
    try {
      const newGame = endTurn()
      updateGameState(newGame)
      completeAction(PLAYER_ACTION.CLAIM_ROUND)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center">
      {showClaimRoundCTA() && (
        <button
          className="mx-1 mb-2 rounded-md bg-red-300 px-6 py-2 shadow-md"
          onClick={roundClaimClick}
        >
          GRANDMA!!!
        </button>
      )}

      {showEndTurnCTA() && (
        <button
          className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
          onClick={endTurnClick}
        >
          End Turn
        </button>
      )}
    </div>
  )
}

export default PlayerCTAs
