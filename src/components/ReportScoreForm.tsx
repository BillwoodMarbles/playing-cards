import React, { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { usePlayerContext } from '@/contexts/PlayerContext'
import { useGameContext } from '@/contexts/GameContext'
import { getGameConfig } from '@/data/game-configs'

const ReportScoreForm = () => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer } = usePlayerContext()

  const [scoreToAdd, setScoreToAdd] = useState(0)

  const gameConfig = getGameConfig(game.gameType)

  const updateScoreToAdd = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      setScoreToAdd((prevValue) => prevValue + (gameConfig.pointCount || 1))
    } else {
      setScoreToAdd((prevValue) => prevValue - (gameConfig.pointCount || 1))
    }
  }

  const onReportScore = () => {
    if (game) {
      const newGame = { ...game }

      newGame.players.forEach((player) => {
        if (player.id === myPlayer?.id) {
          player.score += scoreToAdd
        }
      })

      setScoreToAdd(0)

      newGame.lastMove = {
        playerId: myPlayer?.id || '',
        action: 'report-score',
        card: null,
      }
      updateGameState(newGame)
    }
  }

  return (
    <div className="my-4 w-full border border-white bg-slate-50 py-3">
      <div className="mb-4 flex items-center justify-center">
        <button
          className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-red-300 px-2 py-1 shadow-md"
          onClick={() => updateScoreToAdd('minus')}
        >
          <FaMinus />
        </button>
        <div className="w-8 text-center">
          <span className="text-lg font-bold">{scoreToAdd}</span>
        </div>
        <button
          className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-violet-300 px-2 py-1 shadow-md"
          onClick={() => updateScoreToAdd('plus')}
        >
          <FaPlus />
        </button>
      </div>

      <div className="text-center">
        <button
          className="mx-1 rounded-md bg-blue-300 px-6 py-2 align-middle shadow-md"
          onClick={onReportScore}
        >
          Save Score{' '}
          <span className="">({(myPlayer?.score || 0) + scoreToAdd})</span>
        </button>
      </div>
    </div>
  )
}

export default ReportScoreForm
