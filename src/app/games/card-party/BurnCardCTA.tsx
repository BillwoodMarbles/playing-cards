import React from 'react'
import useGame from '@/app/hooks/useGame'
import { useGameContext } from '@/app/contexts/GameContext'
import { PLAYER_ACTION } from '@/app/types'
import { usePlayer } from '@/app/contexts/PlayerContext'

const BurnCardCTA = () => {
  const { game, myPlayer, updateGameState } = useGameContext()
  const { burnCardFromPrimaryDeck } = useGame(game, myPlayer)
  const { completeAction } = usePlayer()

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
