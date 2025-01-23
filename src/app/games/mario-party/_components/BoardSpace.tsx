import React, { FC } from 'react'
import { Action } from '../_types/types'

interface BoardSpaceProps {
  action: Action
  onClick: () => void
}

const BoardSpace: FC<BoardSpaceProps> = ({ action, onClick }) => {
  const getActionIconComponent = (action: Action) => {
    const Icon = action?.icon

    if (Icon) {
      return <Icon size={35} />
    }
    return <>-</>
  }

  return (
    <button
      onClick={onClick}
      key={action.name}
      className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white p-2 text-center text-white"
      style={{ backgroundColor: action.color }}
    >
      {action.icon && (
        <div className="text-2xl">{getActionIconComponent(action)}</div>
      )}
    </button>
  )
}

export default BoardSpace
