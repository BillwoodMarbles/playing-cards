import React from 'react'

const luckyRolls = [
  { name: 'Recieve item', rollValue: 1 },
  { name: 'Recieve 5 coins', rollValue: '2 or 5' },
  { name: 'Recieve 10 coins', rollValue: '3 or 4' },
  { name: 'Recieve 15 coins', rollValue: 6 },
]

const LuckyDescriptionBlock = () => {
  return (
    <div>
      <ul className="text-left">
        {luckyRolls.map((roll) => (
          <li key={roll.name}>
            {roll.rollValue} - {roll.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LuckyDescriptionBlock
