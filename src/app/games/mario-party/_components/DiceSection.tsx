import React, { useEffect, useState } from 'react'
import { IoDiceOutline } from 'react-icons/io5'
import { dice } from '../_data/dice'
import DiceBlock from './DiceBlock'

const DiceSection = () => {
  const [result, setResult] = useState<string | number>('')

  useEffect(() => {
    if (result) {
      console.log(result)
    }
  }, [result])

  const movementDie = dice[0]
  const playerDie = dice[1]

  return (
    <section className="flex w-full flex-col justify-center rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <IoDiceOutline />
        </div>
        <div className="ml-2">Dice</div>
      </div>

      <div className="mb-2 flex items-center justify-center space-x-2">
        <DiceBlock
          key={movementDie.name}
          die={movementDie}
          onRollResult={setResult}
        />
        <DiceBlock
          key={playerDie.name}
          die={playerDie}
          onRollResult={setResult}
        />
      </div>
    </section>
  )
}

export default DiceSection
