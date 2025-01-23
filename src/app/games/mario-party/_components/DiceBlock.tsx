import React, { FC, useState } from 'react'
import { Die as IDie } from '../_types/types'
import Die from './Die'

interface DiceBlockProps {
  die: IDie
  onRollResult: (value: string | number) => void
}

const DiceBlock: FC<DiceBlockProps> = ({ die, onRollResult }) => {
  const [result, setResult] = useState<string | number>('')

  const handleRollResult = (value: string | number) => {
    setResult(value)
    onRollResult(value)
  }

  return (
    <div>
      <Die die={die} onRollResult={handleRollResult} />
      <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-400 bg-white/25 p-2 text-center text-lg leading-tight">
        {result}
      </div>
    </div>
  )
}

export default DiceBlock
