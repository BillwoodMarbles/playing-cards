import React, { useState } from 'react'
import { IoDiceOutline } from 'react-icons/io5'
import { dice } from '../_data/dice'
import DiceBlock from './DiceBlock'

const DiceSection = () => {
  const [result, setResult] = useState<string | number>('')

  return (
    <section className="flex w-full flex-col justify-center rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <IoDiceOutline />
        </div>
        <div className="ml-2">Dice</div>
      </div>

      <div className="mb-2 flex items-center justify-center space-x-2">
        {dice.map((die) => (
          <DiceBlock key={die.name} die={die} onRollResult={setResult} />
        ))}

        <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white bg-white/25 p-2 text-center text-lg leading-tight">
          {result}
        </div>
      </div>
    </section>
  )
}

export default DiceSection
