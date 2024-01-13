import { Card, Game, GameStatus } from '../types'

export const reduceGameData = (gameData: any) => {
  if (gameData) {
    const parsedGame: Game = {
      id: gameData.id,
      code: gameData.code,
      status: gameData.status as GameStatus,
      playerTurn: gameData.playerTurn || 0,
      deck: gameData.deck ? JSON.parse(gameData.deck) : [],
      discardDeck: gameData.discardDeck ? JSON.parse(gameData.discardDeck) : [],
      players: gameData.players ? JSON.parse(gameData.players) : [],
      rounds: gameData.rounds ? JSON.parse(gameData.rounds) : [],
      currentRound: gameData.currentRound || 0,
      gameType: gameData.gameType || 'standard',
      mode: gameData.mode || 'online',
      lastMove: gameData.lastMove
        ? JSON.parse(gameData.lastMove)
        : {
            playerId: '',
            action: '',
            card: null,
          },
    }

    // remove null player cards
    parsedGame.players.forEach((player) => {
      player.cards = player.cards.filter((card: Card) => card !== null)
    })

    return parsedGame
  }

  return null
}
