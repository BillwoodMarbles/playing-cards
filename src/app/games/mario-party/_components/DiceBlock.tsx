import React, { FC } from 'react'
import { Die } from '../_types/types'

interface DiceBlockProps {
  die: Die
  onRollResult: (value: string | number) => void
}

const DiceBlock: FC<DiceBlockProps> = ({ die, onRollResult }) => {
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

export default DiceBlock
