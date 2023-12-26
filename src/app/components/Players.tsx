import React, { FC } from 'react'
import { Player } from '../types'
import { useRouter } from 'next/navigation'
import { useGame } from '../contexts/GameContext'

interface PlayersProps {
  players: Player[]
  playerTurn: string
}

const Players: FC<PlayersProps> = ({ players, playerTurn }) => {
  const router = useRouter()
  const { game } = useGame()

  const playerClick = (playerId: string) => {
    if (game.mode === 'local') {
      // push current route with playerId of clicked player
      router.push(`/play?code=${game.code}&playerId=${playerId}`)
    }
  }

  const getPlayerInitials = (name: string) => {
    const names = name.split(' ')

    if (names.length > 1 && names[1] !== '') {
      return `${names[0][0]}${names[1][0]}`
    }

    return `${names[0][0]}`
  }

  const getPlayerColorByIndex = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-cyan-500',
    ]

    const newIndex = index % colors.length

    return colors[newIndex]
  }

  return (
    <ul className="flex justify-center">
      {players.map((player, index) => {
        return (
          <li key={player.id} className="relative mx-1">
            {playerTurn === player.id && (
              <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
                <div className="h-2/3 w-2/3 animate-ping rounded-full bg-blue-500"></div>
              </div>
            )}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-white duration-100 ease-in-out${getPlayerColorByIndex(
                index
              )}`}
              onClick={() => playerClick(player.id)}
            >
              <div
                className={`relative z-10 flex items-center justify-center rounded-lg px-1 py-0 text-center text-base text-white`}
              >
                {getPlayerInitials(player.name)}
              </div>

              <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white text-center text-xs leading-none">
                {player.score || 0}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Players
