import React, { FC } from 'react'
import { Card, CardAnimation } from '@/types/types'
import '../styles/decks.css'
import { MiniGameRequirements, getMiniGameByTitle } from '@/data/party-cards'
import { FaCoins, FaDice, FaPencilAlt, FaRunning } from 'react-icons/fa'
import { CgCardSpades } from 'react-icons/cg'
import { GiGlassShot } from 'react-icons/gi'
import { IoBeer } from 'react-icons/io5'

interface MiniGameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card
  hidden?: boolean
  onClick?: () => void
  disabled?: boolean
  selected?: boolean
  index?: number
  animation?: CardAnimation
}

const MiniGameCard: FC<MiniGameCardProps> = ({
  card,
  hidden,
  disabled,
  onClick,
  selected,
  index,
  animation = 'none',
}) => {
  const selectedClass = selected ? 'ring-2 ring-blue-300 -translate-y-2' : ''
  const miniGame =
    card?.type === 'non-standard' && card.name
      ? getMiniGameByTitle(card.name)
      : undefined
  const disabledClass = disabled ? 'cursure-default' : 'cursor-pointer'

  const onCardClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  const animationClass = () => {
    if (animation === 'new-deal') {
      return 'animate-reveal-hand'
    }

    if (animation === 'draw-from') {
      return 'animate-slide-out'
    }

    if (animation === 'draw-to') {
      return 'animate-slide-in-up'
    }

    if (animation === 'draw-from-reverse') {
      return 'animate-slide-up-out'
    }

    if (animation === 'discard') {
      return 'animate-slide-in-down'
    }

    if (animation === 'discard-reverse') {
      return 'animate-slide-in-up'
    }

    return ''
  }

  const getMiniGameIcon = () => {
    if (miniGame?.icon && miniGame?.title) {
      const IconComponent = getMiniGameByTitle(miniGame?.title)?.icon
      if (IconComponent) {
        return <IconComponent />
      }
    }
  }

  const getRequirementIcon = (requirement: MiniGameRequirements) => {
    switch (requirement) {
      case 'dice':
        return <FaDice />
      case 'cards':
        return <CgCardSpades />
      case 'coins':
        return <FaCoins />
      case 'shot-glass':
        return <GiGlassShot />
      case 'standing':
        return <FaRunning />
      case 'drinking':
        return <IoBeer />
      case 'drawing':
        return <FaPencilAlt />
      default:
        return null
    }
  }

  return (
    <div
      onClick={onCardClick}
      className={`relative flex items-center justify-center rounded-lg shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] transition duration-75 ease-in-out 
      ${disabledClass} ${selectedClass} ${animationClass()} ${
        hidden
          ? 'deck-party bg-gradient-to-br from-red-300 to-red-400'
          : 'bg-white'
      }`}
      style={
        {
          zIndex: index,
          '--animation-delay': `0ms`,
        } as React.CSSProperties
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="420"
        width="340"
        className="h-auto w-full"
      />
      {hidden && (
        <div className="absolute left-0 top-0 h-full w-full rounded-lg border border-white p-2 ">
          <div className="h-full w-full rounded-lg border border-white opacity-50"></div>
        </div>
      )}

      {!hidden && miniGame && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col text-center text-black">
          <div>
            <div className="p-4">
              <h3 className="text-xl font-bold uppercase leading-5 text-sky-700">
                {miniGame.title}
              </h3>
            </div>
          </div>
          <div className="flex h-full w-full items-start overflow-y-auto px-4 pb-4 text-center">
            <div className="w-full text-left">
              {miniGame?.icon && (
                <>
                  <div className="mb-4 flex justify-center text-5xl text-sky-700">
                    {getMiniGameIcon()}
                  </div>
                </>
              )}

              {miniGame?.description?.map((line, index) => {
                return (
                  <p key={index} className="mb-3 text-sm">
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
          <div>
            <hr className="mx-4 border-t-2 border-gray-500" />
            <div className="relative w-full p-4 text-base">
              <p>
                <strong>{miniGame.reward}</strong>
              </p>

              <div className="absolute right-0 top-0 flex h-full items-center px-4">
                {miniGame.requirements?.map((line, index) => {
                  return (
                    <div
                      key={index}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-lg"
                    >
                      {getRequirementIcon(line)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniGameCard
