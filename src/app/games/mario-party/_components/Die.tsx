import React, { FC } from 'react'
import { Die as IDie } from '../_types/types'

interface DieProps {
  die: IDie
  onRollResult: (value: string | number) => void
}
const Die: FC<DieProps> = ({ die, onRollResult }) => {
  const onRollDice = () => {
    const randomIndex = Math.floor(Math.random() * die.values.length)
    onRollResult(die.values[randomIndex])
  }

  const Icon = die.icon

  return (
    <button
      key={die.name}
      className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white p-2 text-center text-white"
      style={{ backgroundColor: die.color }}
      onClick={onRollDice}
    >
      <Icon size={50} />
    </button>
  )
}

export default Die
