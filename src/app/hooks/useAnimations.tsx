import { useEffect, useState } from 'react'
import { Card, CardAnimation, Game, Player } from '../types'

const useAnimations = (game: Game | null, player: Player | null) => {
  const [newDealAnimationInProgress, setNewDealAnimationInProgress] =
    useState(false)

  const getDeckAnimation = (deckType: string) => {
    if (!game) {
      return 'none'
    }

    if (
      deckType === 'discard' &&
      (game.lastMove?.action === 'discard' ||
        game.lastMove?.action === 'burn-from-deck')
    ) {
      if (game.lastMove.playerId === player?.id) {
        return 'discard'
      } else {
        return 'discard-reverse'
      }
    }

    if (
      deckType === 'discard-bg' &&
      game.lastMove?.action === 'draw-from-discard'
    ) {
      if (game.lastMove.playerId === player?.id) {
        return 'draw-from'
      } else {
        return 'draw-from-reverse'
      }
    }

    if (deckType === 'deck' && game.lastMove?.action === 'draw-from-deck') {
      if (game.lastMove.playerId === player?.id) {
        return 'draw-from'
      } else {
        return 'draw-from-reverse'
      }
    }
  }

  const getCardAnimation = (card: Card): CardAnimation => {
    const lastCardInHand = player?.cards?.[player.cards.length - 1]
    const lastMoveAction = game?.lastMove?.action

    if (
      (lastMoveAction === 'draw-from-deck' ||
        lastMoveAction === 'draw-from-discard') &&
      game?.lastMove?.playerId === player?.id &&
      card.id === lastCardInHand?.id
    ) {
      return 'draw-to'
    }

    if (newDealAnimationInProgress) {
      return 'new-deal'
    }

    return 'none'
  }

  useEffect(() => {
    if (game?.lastMove?.action === 'new-deal') {
      setNewDealAnimationInProgress(true)

      setTimeout(() => {
        setNewDealAnimationInProgress(false)
      }, 1000)
    }
  }, [game])

  return {
    getDeckAnimation,
    getCardAnimation,
  }
}

export default useAnimations
