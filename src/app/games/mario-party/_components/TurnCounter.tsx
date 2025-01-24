import React, { FC, useState } from 'react'
import { PiClockCountdown } from 'react-icons/pi'

interface TurnCounterProps {}

const TurnCounter: FC<TurnCounterProps> = () => {
  const [currentTurn, setCurrentTurn] = useState(0)

  const handleNextTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % 20)
  }

  return (
    <div className="flex w-full flex-col justify-center rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <PiClockCountdown />
        </div>
        <div className="ml-2">Turn Count</div>
        <div className="ml-2 flex items-center justify-center">
          <button
            onClick={handleNextTurn}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-center sm:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          {currentTurn + 1}
        </div>
      </div>

      <div
        className={'hidden w-full flex-wrap justify-between gap-y-2 sm:flex'}
      >
        <div className="flex flex-1 justify-around">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-50"
              style={{
                backgroundColor: i === currentTurn ? 'blue' : 'white',
                color: i === currentTurn ? 'white' : 'black',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex flex-1 justify-around">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i + 10}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-50"
              style={{
                backgroundColor: i + 10 === currentTurn ? 'blue' : 'white',
                color: i + 10 === currentTurn ? 'white' : 'black',
              }}
            >
              {i + 11}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TurnCounter
