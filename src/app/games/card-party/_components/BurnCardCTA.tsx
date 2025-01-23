import React from 'react'
import useGame from '@/hooks/useGame'
import { useGameContext } from '@/contexts/GameContext'
import { PLAYER_ACTION } from '@/types/types'
import { usePlayerContext } from '@/contexts/PlayerContext'

const BurnCardCTA = () => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer, completeAction } = usePlayerContext()

  const { burnCardFromPrimaryDeck } = useGame(game, myPlayer)

  const burdCard = () => {
    const newGame = burnCardFromPrimaryDeck()
    updateGameState(newGame)
    completeAction(PLAYER_ACTION.DRAW)
  }

  return (
    <button
      className="mx-1 rounded-md bg-blue-300 px-6 py-2 shadow-md"
      onClick={burdCard}
    >
      Discard
    </button>
  )
}

export default BurnCardCTA
