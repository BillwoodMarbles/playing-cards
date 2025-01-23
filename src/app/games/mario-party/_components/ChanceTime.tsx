import React, { useEffect, useState } from 'react'
import DiceBlock from './DiceBlock'
import { dice } from '../_data/dice'

const ChanceTime = () => {
  const [firstResult, setFirstResult] = useState<string | number>('')
  const [secondResult, setSecondResult] = useState<string | number>('')
  const [thirdResult, setThirdResult] = useState<string | number>('')

  useEffect(() => {
    if (firstResult) {
      console.log(firstResult)
    }

    if (secondResult) {
      console.log(secondResult)
    }

    if (thirdResult) {
      console.log(thirdResult)
    }
  }, [firstResult, secondResult, thirdResult])

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
      </div>
      <div>
        <DiceBlock
          die={dice[2]}
          onRollResult={(value) => onRollResult(value, 1)}
        />
      </div>
      <div>
        <DiceBlock
          die={dice[1]}
          onRollResult={(value) => onRollResult(value, 2)}
        />
      </div>
    </div>
  )
}

export default ChanceTime
