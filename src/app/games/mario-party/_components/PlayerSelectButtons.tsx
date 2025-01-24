import React, { FC } from 'react'
import { useGameState } from '../_contexts/MarioPartyContext'
import { MarioPartyPlayer } from '../_types/types'

interface PlayerSelectButtonsProps {
  onPlayerClick: (player: MarioPartyPlayer) => void
}
const PlayerSelectButtons: FC<PlayerSelectButtonsProps> = ({
  onPlayerClick,
}) => {
  const { players } = useGameState()
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex flex-col items-center justify-center"
        >
          <button
            key={player.id}
            type="button"
            onClick={() => onPlayerClick(player)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 "
            style={{ backgroundColor: player.color }}
          ></button>
          {player.character}
        </div>
      ))}
    </div>
  )
}

export default PlayerSelectButtons
