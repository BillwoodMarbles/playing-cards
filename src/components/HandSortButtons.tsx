import React, { FC } from 'react'
import { Card } from '@/types/types'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useGameContext } from '@/contexts/GameContext'
import { usePlayerContext } from '@/contexts/PlayerContext'

interface HandSortButtonsProps {
  selectedCard: Card | null
}

const HandSortButtons: FC<HandSortButtonsProps> = ({ selectedCard }) => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer } = usePlayerContext()

  const changeCardOrder = (card: Card, orderAdjustment: number) => {
    if (game && myPlayer) {
      const playerIndex = game.players.findIndex(
        (player) => player.id === myPlayer.id
      )
      const newGame = { ...game }
      const newPlayerCards = [...myPlayer.cards]
      const cardIndex = newPlayerCards.findIndex((c) => c.id === card.id)
      const cardToSwap = newPlayerCards[cardIndex + orderAdjustment]
      if (!cardToSwap) {
        return
      }
      newPlayerCards[cardIndex + orderAdjustment] = card
      newPlayerCards[cardIndex] = cardToSwap
      newGame.players[playerIndex].cards = newPlayerCards
      updateGameState(newGame, true)
    }
  }

  return (
    selectedCard && (
      <>
        <div className="absolute -left-4 top-1/2 z-50 flex -translate-y-1/2 items-center">
          <button
            className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 px-2 py-1 shadow-md"
            onClick={() => changeCardOrder(selectedCard, -1)}
          >
            <FaAngleLeft />
          </button>
        </div>

        <div className="absolute -right-4 top-1/2 z-50 flex -translate-y-1/2 items-center">
          <button
            className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 px-2 py-1 shadow-md"
            onClick={() => changeCardOrder(selectedCard, 1)}
          >
            <FaAngleRight />
          </button>
        </div>
      </>
    )
  )
}

export default HandSortButtons
