import React, { FC } from 'react'
import { MarioPartyPlayer } from '../_types/types'

interface PlayerTokenProps {
  player: MarioPartyPlayer
  onClick?: () => void
}
const PlayerToken: FC<PlayerTokenProps> = ({ player, onClick }) => {
  const handleClick = () => {
    console.log('Clicked on player token')

    if (onClick) onClick()
  }

  return (
    <>
      <div
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-white p-2 text-center text-white"
        style={{ backgroundColor: player.color }}
        onClick={handleClick}
      ></div>
      <div className="mb-1">{player.character}</div>
    </>
  )
}

export default PlayerToken
