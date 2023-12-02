import { GameTypes } from "./data/game-configs";

export interface Card {
  id: number;
  suit: number;
  value: number;
  status?: "visible" | "hidden" | "none";
}

export type CardAnimation =
  | "draw-from"
  | "draw-from-reverse"
  | "draw-to"
  | "draw-reverse"
  | "discard"
  | "discard-reverse"
  | "none"
  | "new-deal";

export interface Round {
  id: number;
  status: "open" | "in-progress" | "complete" | "last-turn";
  score: any;
  drawCount: number;
  roundWinner: string;
  dealer: string;
  turnCount: number;
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
  type: "draw" | "discard";
  completed: boolean;
  description: string;
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

export type GameStatus = "open" | "in-progress" | "complete";
