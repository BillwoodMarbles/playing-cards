import Deck from '@/components/Deck'
import { useGameContext } from '@/contexts/GameContext'
import { usePlayerContext } from '@/contexts/PlayerContext'
import useAnimations from '@/hooks/useAnimations'
import useGame from '@/hooks/useGame'
import { Card, PLAYER_ACTION } from '@/types/types'
import React, { FC } from 'react'

const MiniGameDeck: FC = () => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer, currentAction, completeAction } = usePlayerContext()

  const { revealCard: RevealCard } = useGame(game, myPlayer)
  const { getDeckAnimation } = useAnimations(game, myPlayer)

  const revealCard = (card?: Card) => {
    if (!card) {
      return
    }
    const newGame = RevealCard(card)
    updateGameState(newGame)
    completeAction(PLAYER_ACTION.REVEAL_CARD)
  }

  return (
    <Deck
      size="full"
      cards={game.deck}
      enabled={Boolean(
        currentAction?.availableActions.includes(PLAYER_ACTION.REVEAL_CARD)
      )}
      onClick={revealCard}
      animation={getDeckAnimation('deck')}
      disabledPulse
    />
  )
}

export default MiniGameDeck
