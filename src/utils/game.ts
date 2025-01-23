import { GameTypes } from '../data/game-configs'
import { Card, Game, Player } from '../types/types'

export const getCurrentRound = (game: Game) => {
  return game.rounds[game.currentRound]
}

export const getCurrentRoundWinner = (game: Game): Player | undefined => {
  const round = game.rounds[game.currentRound]

  if (round?.roundWinner) {
    const roundWinnderIndex = game.players.findIndex(
      (player) => player.id === round.roundWinner
    )
    return game.players[roundWinnderIndex]
  }

  return
}

export const getGameWinner = (game: Game) => {
  const players = [...game.players]
  players.sort((a, b) => {
    return b.score - a.score
  })

  return players[players.length - 1]
}

export const getNextPlayer = (game: Game): Player | void => {
  const currentPlayerIndex = game.players.findIndex(
    (player) => player.id === game.playerTurn
  )
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length
  const nextPlayer = game.players[nextPlayerIndex]
  return nextPlayer
}

export const isWildCard = (game: Game, card: Card) => {
  if (game.gameType === GameTypes.GRANDMA) {
    const roundWildCard = (getCurrentRound(game)?.drawCount || 0) - 1

    if (card.value === roundWildCard) {
      return true
    }
  }

  return card.value === 13
}
