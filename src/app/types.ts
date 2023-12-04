import { GameTypes } from "./data/game-configs";

// enums
export enum PlayerActions {
  DRAW = "draw",
  DISCARD = "discard",
  REVEAL_CARD = "reveal-card",
  PEEK = "peak",
}

// interfaces
export interface Card {
  id: number;
  suit: number;
  value: number;
  status?: "visible" | "hidden" | "none" | "peeked";
}

export interface Round {
  id: number;
  status: "open" | "in-progress" | "complete" | "last-turn";
  score: any;
  drawCount: number;
  roundWinner: string;
  dealer: string;
  turnCount: number;
  playerActions: PlayerAction[];
  maxTurns?: number;
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  type: "host" | "player";
  score: number;
}

export interface PlayerAction {
  type: PlayerActions;
  completed: boolean;
  description: string;
  preRound?: boolean;
}

export interface GameConfig {
  id: number;
  rounds: Round[];
  minPlayers: number;
  maxPlayers: number;
  type: string;
  name: string;
  deckCount: number;
  deckType: string;
  pointCount?: number;
}

export interface PlayerMove {
  playerId: string;
  action:
    | "draw-from-deck"
    | "draw-from-discard"
    | "discard"
    | "claim-round"
    | "player-join"
    | "new-deal"
    | "new-game"
    | "start-round"
    | "end-round"
    | "end-turn"
    | "end-game"
    | "report-score"
    | "reveal-card"
    | "none";
  card: Card | null;
}

export interface Game {
  id: string;
  code: string;
  players: Player[];
  deck: Card[];
  discardDeck: Card[];
  playerTurn: string;
  status: GameStatus;
  rounds: Round[];
  currentRound: number;
  gameType: GameTypes;
  lastMove: PlayerMove | null;
}

// types
export type CardAnimation =
  | "draw-from"
  | "draw-from-reverse"
  | "draw-to"
  | "draw-reverse"
  | "discard"
  | "discard-reverse"
  | "none"
  | "new-deal";

export type GameStatus = "open" | "in-progress" | "complete";
