import React, { FC, FormEvent, useState } from 'react'
import { useGameContext } from '@/contexts/GameContext'
import { Player } from '@/types/types'
import { v4 as UUID } from 'uuid'
import useGame from '@/hooks/useGame'
import { usePathname, useRouter } from 'next/navigation'

interface JoinGameFormProps {}

const JoinGameForm: FC<JoinGameFormProps> = () => {
  const [playerName, setPlayerName] = useState('')
  const { game, updateGameState } = useGameContext()
  const { addPlayer } = useGame(game)

  const router = useRouter()
  const pathname = usePathname()

  const createNewPlayer = (playerName: string): Player => {
    return {
      score: 0,
      name: playerName,
      cards: [],
      id: UUID(),
      type: 'player',
    }
  }

  const createPlayerAndAddToGame = (name: string) => {
    const player = createNewPlayer(name)
    const newGameState = addPlayer(player)
    updateGameState(newGameState)
    return player
  }

  const navigateToGame = (gameCode: string, playerId: string) => {
    router.push(`${pathname}?code=${gameCode}&playerId=${playerId}`)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const player = createPlayerAndAddToGame(playerName)
    navigateToGame(game?.code, player?.id)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex">
        <label className="mr-1">
          <input
            className="w-full rounded-md border border-gray-400 px-3 py-2"
            type="text"
            value={playerName}
            placeholder="Player Name"
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>

        <button
          disabled={playerName.length === 0}
          className="mb-5 rounded-md bg-blue-300 px-6 py-2 shadow-md"
          type="submit"
        >
          Join Game
        </button>
      </div>
    </form>
  )
}
export default JoinGameForm
