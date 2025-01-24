import React, { FC } from 'react'
import { Action } from '../_types/types'

interface BoardSpaceProps {
  action: Action
  variant?: 'base' | 'dark'
  onClick: () => void
}

const BoardSpace: FC<BoardSpaceProps> = ({ action, variant, onClick }) => {
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
      className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
        variant === 'dark'
          ? 'border-slate-600 text-slate-600'
          : 'border-white text-white'
      } p-2 text-center`}
      style={{ backgroundColor: action.color }}
    >
      {action.icon && (
        <div className="text-2xl">{getActionIconComponent(action)}</div>
      )}
    </button>
  )
}

export default BoardSpace
