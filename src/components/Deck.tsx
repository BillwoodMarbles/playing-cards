import { FC, useEffect } from 'react'
import { Card, CardAnimation } from '@/types/types'
import CardFactory from './CardFactory'
import React from 'react'
import CardComponent from './Card'

interface DeckProps {
  cards: Card[]
  enabled: boolean
  animation?: CardAnimation
  showTopCard?: boolean
  size?: 'small' | 'medium' | 'large' | 'full'
  disabledPulse?: boolean
  onClick: (card?: Card) => void
  onEmpty?: () => void
}

const Deck: FC<DeckProps> = ({
  cards,
  enabled,
  animation,
  disabledPulse,
  showTopCard,
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
      <div className="relative">
        {enabled && !disabledPulse && (
          <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
            <div
              className={`h-3/5 w-3/5 animate-ping bg-blue-500 ${getSizeClasses()}`}
            ></div>
          </div>
        )}

        {cards.length > 0 ? (
          (() => {
            const card = cards[cards.length - 1]

            return (
              <>
                <div className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white text-center text-xs leading-none">
                  {cards.length}
                </div>

                <div className="absolute left-0 top-0">
                  <CardFactory size={size} card={card} hidden disabled />
                </div>

                <div className="relative z-10">
                  <CardFactory
                    key={card.id}
                    card={card}
                    onClick={() => onClick(card)}
                    hidden={
                      card.status === 'hidden' ||
                      card.status === 'none' ||
                      !showTopCard
                    }
                    disabled={!enabled}
                    animation={animation}
                    size={size}
                  ></CardFactory>
                </div>
              </>
            )
          })()
        ) : (
          <CardComponent
            size={size}
            onClick={() => onClick()}
            disabled={!enabled}
          />
        )}
      </div>
    </>
  )
}

export default Deck
