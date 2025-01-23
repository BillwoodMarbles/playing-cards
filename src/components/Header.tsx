import React, { FC } from 'react'
import { FaShareFromSquare } from 'react-icons/fa6'
import { useGameContext } from '@/contexts/GameContext'
import { IoExit } from 'react-icons/io5'
import useGame from '@/hooks/useGame'

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { game, gameConfig, updateGameState } = useGameContext()
  const { resetGame: ResetGame } = useGame(game)
  const currentRound = game?.rounds[game?.currentRound]

  const copyCurrentRouteToClipboard = () => {
    let path = window.location.href.split('?')[0]
    path += `?code=${game?.code}`
    navigator.clipboard.writeText(path)
  }

  const resetGame = () => {
    const newGame = ResetGame()
    updateGameState(newGame)
  }

  return (
    <header className="flex w-full items-center px-4 py-3">
      <div className="w-1/4">
        <button
          className="ml-2 flex items-center"
          onClick={copyCurrentRouteToClipboard}
        >
          {game?.code}
          <FaShareFromSquare className="ml-2" />
        </button>
      </div>
      <div className="grow text-center">
        <h1 className="text-2xl">{gameConfig.name}</h1>
        {currentRound && (
          <p className="text-xs">
            (round {currentRound.id >= 0 ? currentRound.id + 1 : '-'} of{' '}
            {game?.rounds.length} - turn {(currentRound.turnCount || 0) + 1} of{' '}
            {currentRound.maxTurns || '∞'})
          </p>
        )}
      </div>

      <div className="flex w-1/4 justify-end">
        <button className="ml-2 flex items-center" onClick={resetGame}>
          <IoExit className="ml-2 text-xl" />
        </button>
      </div>
    </header>
  )
}

export default Header
