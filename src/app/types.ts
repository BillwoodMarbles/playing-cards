import { GameTypes } from './data/game-configs'
import { MiniGameType } from './data/party-cards'

// enums
export enum PLAYER_ACTION {
  DRAW = 'draw',
  DISCARD = 'discard',
  DISCARD_DRAWN_CARD = 'discard-drawn-card',
  END_TURN = 'end-turn',
  START_TURN = 'start-turn',
  REVEAL_CARD = 'reveal-card',
  PEEK = 'peak',
  CLAIM_ROUND = 'claim-round',
  CLEAR_TURNS = 'clear-turns',
  CUT_DECK = 'cut-deck',
  BURN_CARD = 'burn-card',
}

// interfaces
export interface Card {
  id: number
  suit?: number
  value?: number
  type: 'standard' | 'non-standard'
  name?: MiniGameType
  status?:
    | 'visible'
    | 'visible-never-discard'
    | 'visible-deck-draw'
    | 'visible-discard-draw'
    | 'hidden'
    | 'none'
    | 'peeked'
}

export interface Round {
  id: number
  status: 'open' | 'in-progress' | 'complete' | 'last-turn'
  drawCount: number
  roundWinner: string
  dealer: string
  turnCount: number
  maxTurns?: number
}

export interface Player {
  id: string
  name: string
  cards: Card[]
  type: 'host' | 'player'
  score: number
}

export interface PlayerAction {
  availableActions: PLAYER_ACTION[]
  actionTaken: PLAYER_ACTION | null
  description?: string
}

export interface GameConfig {
  id: number
  rounds: Round[]
  minPlayers: number
  maxPlayers: number
  type: string
  name: string
  deckCount: number
  deckType: string
  pointCount?: number
}

export interface PlayerMove {
  playerId: string
  action:
    | 'burn-from-deck'
    | 'draw-from-deck'
    | 'draw-from-discard'
    | 'discard'
    | 'claim-round'
    | 'player-join'
    | 'new-deal'
    | 'new-game'
    | 'start-round'
    | 'end-round'
    | 'end-turn'
    | 'end-game'
    | 'report-score'
    | 'reveal-card'
    | 'reset-game'
    | 'none'
  card: Card | null
}

export interface Game {
  id: string
  code: string
  players: Player[]
  deck: Card[]
  discardDeck: Card[]
  playerTurn: string
  status: GameStatus
  rounds: Round[]
  currentRound: number
  gameType: GameTypes
  lastMove: PlayerMove | null
  mode: 'local' | 'online'
}

// types
export type CardAnimation =
  | 'draw-from'
  | 'draw-from-reverse'
  | 'draw-to'
  | 'draw-reverse'
  | 'discard'
  | 'discard-reverse'
  | 'none'
  | 'new-deal'

export type GameStatus = 'open' | 'in-progress' | 'complete'

export type GameMode = 'local' | 'online'
