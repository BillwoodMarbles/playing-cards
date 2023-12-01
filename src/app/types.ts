export interface Card {
  id: number;
  suit: number;
  value: number;
  status?: "drawn" | "in-hand" | "discarded" | "new-deal" | "none";
}

export type CardAnimation = "draw" | "discard" | "none" | "new-deal";

export interface Round {
  id: number;
  status: "open" | "in-progress" | "complete";
  score: any;
  drawCount: number;
  roundWinner: string;
  dealer: string;
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  type: "host" | "player";
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
  gameType: string;
}

export type GameStatus = "open" | "in-progress" | "complete";
