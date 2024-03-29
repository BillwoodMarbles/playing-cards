import Deck from '@/app/components/Deck'
import { useGameContext } from '@/app/contexts/GameContext'
import { usePlayerContext } from '@/app/contexts/PlayerContext'
import useAnimations from '@/app/hooks/useAnimations'
import useGame from '@/app/hooks/useGame'
import { Card, PLAYER_ACTION } from '@/app/types'
import React, { FC } from 'react'

const MiniGameDeck: FC = () => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer, currentAction, completeAction } = usePlayerContext()

  const { revealCard: RevealCard } = useGame(game, myPlayer)
  const { getDeckAnimation } = useAnimations(game, myPlayer)

  const revealCard = (card: Card) => {
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
