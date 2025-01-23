import React, { useState } from 'react'
import DiceBlock from './DiceBlock'
import { dice } from '../_data/dice'

const ChanceTime = () => {
  const [firstResult, setFirstResult] = useState<string | number>('')
  const [secondResult, setSecondResult] = useState<string | number>('')
  const [thirdResult, setThirdResult] = useState<string | number>('')

  const onRollResult = (value: string | number, index: number) => {
    if (index === 0) {
      setFirstResult(value)
    } else if (index === 1) {
      setSecondResult(value)
    } else {
      setThirdResult(value)
    }
  }

  return (
    <div className="flex space-x-4">
      <div>
        <DiceBlock
          die={dice[1]}
          onRollResult={(value) => onRollResult(value, 0)}
        />

        <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-400 bg-white/25 p-2 text-center text-lg leading-tight">
          {firstResult}
        </div>
      </div>
      <div>
        <DiceBlock
          die={dice[2]}
          onRollResult={(value) => onRollResult(value, 1)}
        />

        <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-400 bg-white/25 p-2 text-center text-lg leading-tight">
          {secondResult}
        </div>
      </div>
      <div>
        <DiceBlock
          die={dice[1]}
          onRollResult={(value) => onRollResult(value, 2)}
        />

        <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-400 bg-white/25 p-2 text-center text-lg leading-tight">
          {thirdResult}
        </div>
      </div>
    </div>
  )
}

export default ChanceTime
