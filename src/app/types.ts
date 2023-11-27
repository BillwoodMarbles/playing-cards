export interface Card {
  id: number;
  suit: number;
  value: number;
}

export interface Round {
  id: number;
  status: "open" | "in-progress" | "complete";
  score: any;
  drawCount: number;
  roundWinner: number;
  dealer: number;
}

export interface Player {
  id: number;
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
  playerTurn: number;
  status: GameStatus;
  rounds: Round[];
  currentRound: number;
  gameType: string;
}

export type GameStatus = "open" | "in-progress" | "complete";
