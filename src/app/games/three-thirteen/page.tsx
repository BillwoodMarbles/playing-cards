'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../../../amplifyconfiguration.json'
import '@/styles/animations.css'
import { GameContextProvider } from '@/contexts/GameContext'
import { PlayerContextProvider } from '@/contexts/PlayerContext'
import useGameQuery from '@/hooks/useGameQuery'
import { GameTypes } from '@/data/game-configs'
import ThreeThirteenBoard from './_components/ThreeThirteenBoard'

Amplify.configure(amplifyconfig)

const ThreeThirteen = () => {
  const [playerId, setPlayerId] = useState('')

  const searchParams = useSearchParams()
  const { game } = useGameQuery(
    searchParams.get('code') || '',
    GameTypes.GRANDMA
  )

  useEffect(() => {
    const playerId = searchParams.get('playerId')

    if (playerId) {
      setPlayerId(playerId)
    }
  }, [searchParams])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <GameContextProvider playerId={playerId} initialGame={game}>
      <PlayerContextProvider playerId={playerId}>
        <ThreeThirteenBoard />
      </PlayerContextProvider>
    </GameContextProvider>
  )
}

export default ThreeThirteen
