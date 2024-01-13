import React, { FC } from 'react'
import { useGameContext } from '../contexts/GameContext'
import { usePlayerContext } from '../contexts/PlayerContext'
import { GameTypes, getGameConfig } from '../data/game-configs'

interface GameNotificationsProps {}

const GameNotifications: FC<GameNotificationsProps> = () => {
  const { currentRound, game } = useGameContext()
  const { currentAction, myPlayer, isMyTurn } = usePlayerContext()

  const isLastRound = () => {
    return game.currentRound === game.rounds.length - 1
  }

  const getPlayerById = (playerId: string) => {
    return game.players.find((player) => player.id === playerId)
  }

  const getNotifcations = () => {
    const notifications = []
    const gameConfig = getGameConfig(game.gameType)

    if (game?.status === 'open') {
      if (game.players.length < gameConfig.minPlayers) {
        notifications.push(
          <div className="text-center">Waiting for players...</div>
        )
      } else {
        if (myPlayer?.type === 'host') {
          notifications.push(<div className="text-center">Ready to start</div>)
        } else {
          notifications.push(
            <div className="text-center">Waiting for host to start</div>
          )
        }
      }
    } else if (game?.status === 'in-progress') {
      if (currentRound?.status === 'complete') {
        if (isLastRound()) {
          notifications.push(<div className="text-center">Game Over</div>)
        } else {
          notifications.push(
            <div className="text-center">Round Over: Report your score.</div>
          )
        }
      } else if (
        currentRound?.status === 'open' &&
        game.gameType !== GameTypes.CARD_PARTY
      ) {
        if (currentRound?.dealer === myPlayer?.id) {
          notifications.push(<div className="text-center">Ready to deal</div>)
        } else {
          notifications.push(
            <div className="text-center">
              Waiting for{' '}
              <strong>{getPlayerById(currentRound.dealer)?.name}</strong> to
              deal
            </div>
          )
        }
      } else {
        if (currentRound?.roundWinner) {
          notifications.push(
            <div className="text-center">
              GRANDMA!!! - {getPlayerById(currentRound?.roundWinner)?.name}
            </div>
          )
        }

        if (isMyTurn()) {
          notifications.push(currentAction?.description)
        } else {
          notifications.push(
            <div className="text-center">
              {getPlayerById(game.playerTurn)?.name}&lsquo;s Turn
            </div>
          )
        }
      }
    }

    return notifications
  }

  return (
    <div
      className="flex h-10 w-full grow-0 flex-col items-center justify-center bg-slate-200 px-4 py-1 text-xs"
      style={{ minHeight: '2.5rem' }}
    >
      {getNotifcations().map((notification) => {
        return <div key="">{notification}</div>
      })}
    </div>
  )
}

export default GameNotifications
