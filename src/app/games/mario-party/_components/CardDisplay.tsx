import React, { FC } from 'react'
import { Card, ItemCard, MiniGameCard } from '../_types/types'
import { getRequirementIcon, MiniGameRequirements } from '@/data/party-cards'

interface CardDisplayProps {
  card: Card | ItemCard | MiniGameCard
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'dark'
}

const CardDisplay: FC<CardDisplayProps> = ({
  card,
  size = 'medium',
  variant = 'dark',
}) => {
  const Icon = card.icon

  const getRequirementIconComponent = (item: {
    requirement: MiniGameRequirements
  }) => {
    const IconComponent = getRequirementIcon(item.requirement)
    if (!IconComponent) {
      return null
    }
    return <IconComponent size={14} />
  }

  return (
    <div
      className={`deck ${size === 'small' ? 'deck-small' : ''}
        ${size === 'large' ? 'deck-large' : ''}
        ${
          variant === 'dark' ? 'border-gray-800' : 'border-white'
        }  relative flex flex-col items-center justify-between rounded-lg border-2 p-2 text-center `}
    >
      <>
        {'requirements' in card &&
          card.requirements?.map((line, index) => (
            <div
              key={index}
              className="absolute left-0 top-1 ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 text-lg"
            >
              {getRequirementIconComponent({ requirement: line })}
            </div>
          ))}
        {!('requirements' in card) && Icon && size === 'large' && (
          <div className="absolute left-0 top-1 ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 text-lg">
            <Icon size={14} />
          </div>
        )}
      </>
      <header className={`${size === 'large' ? 'px-6 py-2' : 'pb-2 pt-0'}`}>
        <h3 className="text-lg font-bold leading-tight sm:text-sm">
          {card.name}
        </h3>
      </header>

      <div>
        {Icon && (
          <div className="mb-3 flex items-center justify-center">
            <Icon size={40} />
          </div>
        )}

        {size === 'large' && card.description}
      </div>

      <div className="w-full">
        {size !== 'small' && 'shopCost' in card && (
          <div className="flex items-center justify-center border-t border-t-slate-300 pt-2">
            <span className="text-sm">Shop Cost:</span> {card.shopCost}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardDisplay
