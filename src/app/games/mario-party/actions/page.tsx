'use client'

import React, { useState } from 'react'
import DiceSection from '../_components/DiceSection'
import TurnCounter from '../_components/TurnCounter'
import DecksSection from '../_components/DecksSection'
import PlayersSection from '../_components/PlayersSection'
import ActionsSection from '../_components/ActionsSection'
import { GameProvider } from '../_contexts/MarioPartyContext'
import { FaQuestionCircle } from 'react-icons/fa'
import SideDrawer from '../_components/SideDrawer'
import GameRules from '../_components/GameRules'

const ActionsPage = () => {
  const [open, setOpen] = useState(false)

  return (
    <GameProvider>
      <div className="flex h-full w-full grow flex-col items-center justify-between">
        <header className="flex w-full p-4 text-center text-4xl font-bold">
          <div className="w-10"></div>
          <div className="grow">Mario Party</div>
          <button className="w-10" onClick={() => setOpen(true)}>
            <FaQuestionCircle />
          </button>
        </header>

        <div className="flex w-full grow flex-col items-center justify-between space-y-4 bg-cyan-600 p-4">
          <TurnCounter />
          <DecksSection />
          <ActionsSection />
          <PlayersSection />
          <DiceSection />
        </div>

        <SideDrawer open={open} setOpen={setOpen} title="Game Rules">
          <GameRules />
        </SideDrawer>
      </div>
    </GameProvider>
  )
}

export default ActionsPage
