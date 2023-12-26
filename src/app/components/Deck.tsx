import { FC, useEffect } from 'react'
import { Card, CardAnimation } from '../types'
import CardFactory from './CardFactory'
import React from 'react'

interface DeckProps {
  cards: Card[]
  enabled: boolean
  animation?: CardAnimation
  size?: 'small' | 'medium' | 'large' | 'full'
  disabledPulse?: boolean
  onClick: (card: Card) => void
  onEmpty?: () => void
}

const Deck: FC<DeckProps> = ({
  cards,
  enabled,
  animation,
  disabledPulse,
  onClick,
  onEmpty,
  size,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'rounded-md'
      case 'medium':
        return 'rounded-md'
      case 'large':
        return 'rounded-lg'
      case 'full':
        return 'rounded-xl'
      default:
        return 'rounded-lg'
    }
  }

  useEffect(() => {
    if (cards.length === 0 && onEmpty) {
      onEmpty()
    }
  }, [cards])

  return (
    <>
      {cards.length > 0 ? (
        (() => {
          const card = cards[cards.length - 1]
          return (
            <div className="relative">
              {/* <span>{game.deck.length}</span> */}
              {enabled && !disabledPulse && (
                <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
                  <div
                    className={`h-3/5 w-3/5 animate-ping bg-blue-500 ${getSizeClasses()}`}
                  ></div>
                </div>
              )}

              <div className="absolute left-0 top-0">
                <CardFactory size={size} card={card} hidden disabled />
              </div>

              <div className="relative z-10">
                <CardFactory
                  key={card.id}
                  card={card}
                  onClick={() => onClick(card)}
                  hidden={card.status !== 'visible'}
                  disabled={!enabled}
                  animation={animation}
                  size={size}
                ></CardFactory>
              </div>
            </div>
          )
        })()
      ) : (
        <CardFactory size={size} disabled />
      )}
    </>
  )
}

export default Deck
