'use client'

import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../../../amplifyconfiguration.json'
import '@/styles/animations.css'
import { GameContextProvider } from '@/contexts/GameContext'
import PartyBoard from './_components/Board'
import { PlayerContextProvider } from '@/contexts/PlayerContext'
import useGameQuery from '@/hooks/useGameQuery'
import { GameTypes } from '@/data/game-configs'

Amplify.configure(amplifyconfig)

const Play: FC = () => {
  const [playerId, setPlayerId] = useState('123')

  const searchParams = useSearchParams()
  const { game } = useGameQuery(
    searchParams.get('code') || '',
    GameTypes.CARD_PARTY
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
        <PartyBoard />
      </PlayerContextProvider>
    </GameContextProvider>
  )
}

export default Play
