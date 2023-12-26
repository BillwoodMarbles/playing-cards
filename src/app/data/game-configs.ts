import { GameConfig, Round } from '../types'

export enum GameTypes {
  FREE_PLAY = 'free-play',
  GRANDMA = 'grandma',
  MINI_GOLF = 'mini-golf',
  CRIBBAGE = 'cribbage',
  CARD_PARTY = 'card-party',
}

export const GRANDMA_GAME_CONFIG = (): GameConfig => {
  return {
    id: 1,
    rounds: buildGrandmaRounds(),
    minPlayers: 2,
    maxPlayers: 8,
    type: GameTypes.GRANDMA,
    name: 'Grandma!',
    deckCount: 2,
    deckType: 'standard-with-jokers',
    pointCount: 5,
  }
}

export const MINI_GOLF_GAME_CONFIG = (): GameConfig => {
  return {
    id: 1,
    rounds: buildMiniGolfRounds(),
    minPlayers: 2,
    maxPlayers: 8,
    type: GameTypes.MINI_GOLF,
    name: 'Mini Golf',
    deckCount: 1,
    deckType: 'standard-with-jokers',
    pointCount: 1,
  }
}

export const CRIBBAGE_GAME_CONFIG: GameConfig = {
  id: 1,
  rounds: [],
  minPlayers: 2,
  maxPlayers: 4,
  type: GameTypes.CRIBBAGE,
  name: 'Cribbage',
  deckCount: 1,
  deckType: 'standard',
  pointCount: 1,
}

export const CARD_PARTY: GameConfig = {
  id: 1,
  rounds: [],
  minPlayers: 1,
  maxPlayers: 20,
  type: GameTypes.CRIBBAGE,
  name: 'Card Party',
  deckCount: 1,
  deckType: 'card-party',
  pointCount: 1,
}

const buildMiniGolfRounds = () => {
  const rounds: Round[] = []
  for (let i = 0; i < 9; i++) {
    rounds.push({
      id: i,
      status: 'open',
      score: {},
      drawCount: 4,
      roundWinner: '',
      dealer: '',
      maxTurns: 4,
      turnCount: 0,
    })
  }
  return rounds
}

const buildGrandmaRounds = () => {
  const rounds: Round[] = []
  for (let i = 0; i < 11; i++) {
    rounds.push({
      id: i,
      status: 'open',
      score: {},
      drawCount: i + 3,
      roundWinner: '',
      dealer: '',
      turnCount: 0,
    })
  }
  return rounds
}

export const getGameConfig = (gameType?: GameTypes) => {
  switch (gameType) {
    case GameTypes.GRANDMA:
      return GRANDMA_GAME_CONFIG()
    case GameTypes.MINI_GOLF:
      return MINI_GOLF_GAME_CONFIG()
    case GameTypes.CRIBBAGE:
      return CRIBBAGE_GAME_CONFIG
    case GameTypes.CARD_PARTY:
      return CARD_PARTY
    default:
      return GRANDMA_GAME_CONFIG()
  }
}
