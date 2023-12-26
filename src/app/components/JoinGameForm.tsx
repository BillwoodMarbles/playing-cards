import React, { FC, useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { useRouter } from 'next/navigation'

interface JoinGameFormProps {}

const JoinGameForm: FC<JoinGameFormProps> = () => {
  const [playerName, setPlayerName] = useState('')

  const router = useRouter()
  const { game, addPlayer } = useGame()

  const onSubmit = (e: any) => {
    e.preventDefault()
    const player = addPlayer(playerName)
    router.push(`/play?code=${game?.code}&playerId=${player?.id}`)
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
