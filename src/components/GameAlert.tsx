import React, { FC } from 'react'

interface GameAlertProps {
  alertText: string
}

const GameAlert: FC<GameAlertProps> = ({ alertText }) => {
  return (
    <div className="winner-alert absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center">
      <strong className="text-5xl text-violet-600">{alertText}</strong>
    </div>
  )
}
export default GameAlert
