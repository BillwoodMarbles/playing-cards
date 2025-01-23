import React, { FC } from 'react'
import { Card, CardAnimation } from '@/types/types'
import CardComponent from './Card'
import MiniGameCard from './MiniGameCard'

interface CardFactoryProps {
  card?: Card
  onClick?: () => void
  disabled?: boolean
  selected?: boolean
  size?: 'small' | 'medium' | 'large' | 'full'
  hidden?: boolean
  animation?: CardAnimation
}

const CardFactory: FC<CardFactoryProps> = ({
  card,
  size,
  hidden,
  disabled,
  animation,
  onClick,
}) => {
  switch (card?.type) {
    case 'standard':
      return (
        <CardComponent
          card={card}
          size={size}
          hidden={hidden}
          disabled={disabled}
          animation={animation}
          onClick={onClick}
        />
      )
    case 'non-standard':
      return (
        <MiniGameCard
          card={card}
          onClick={onClick}
          animation={animation}
          hidden={hidden}
          disabled={disabled}
        />
      )
    default:
      return (
        <CardComponent
          size={size}
          hidden={hidden}
          disabled={disabled}
          animation={animation}
          onClick={onClick}
        />
      )
  }

  return <div></div>
}

export default CardFactory
