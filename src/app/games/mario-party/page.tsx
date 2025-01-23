'use client'

import React, { FC, useState } from 'react'
import './_styles/board.css'
import DiceSection from './_components/DiceSection'
import TurnCounter from './_components/TurnCounter'
import PlayersSection from './_components/PlayersSection'
import DecksSection from './_components/DecksSection'
import { GameProvider } from './_contexts/MarioPartyContext'
import { FaQuestionCircle } from 'react-icons/fa'
import SideDrawer from './_components/SideDrawer'
import GameRules from './_components/GameRules'
import ActionsSection from './_components/ActionsSection'

// TODO: display ghost, bank, star, item shop,
// TODO: Rules display
// TODO: Display Board special action
// TODO: Bonus Stars
// TODO: Last 5 turn multiplier
interface BoardProps {}
const Board: FC<BoardProps> = () => {
  return (
    <div className="board-wrapper relative flex w-full grow flex-col items-center justify-center">
      <div className="board w-full">
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="absolute left-0 top-3 flex w-full items-center justify-center px-3">
            <DecksSection />
          </div>

          <div className="absolute bottom-3 left-0 flex w-full flex-col items-start justify-between px-3">
            <div className="mb-2 flex w-full items-center justify-center">
              <TurnCounter />
            </div>
            <div className="flex w-full items-start justify-between space-x-2">
              <div>
                <DiceSection />
              </div>
              <ActionsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MarioParty = () => {
  const [open, setOpen] = useState(false)

  return (
    <GameProvider>
      <div className="flex min-h-full w-full grow flex-col items-center">
        <header className="flex w-full p-4 text-center text-4xl font-bold">
          <div className="w-10"></div>
          <div className="grow">Mario Party</div>
          <button className="w-10" onClick={() => setOpen(true)}>
            <FaQuestionCircle />
          </button>
        </header>

        <main className="flex w-full grow flex-col justify-between bg-slate-100 text-center">
          <Board />
          <PlayersSection />
        </main>
      </div>

      <SideDrawer open={open} setOpen={setOpen} title="Game Rules">
        <GameRules />
      </SideDrawer>
    </GameProvider>
  )
}

export default MarioParty
