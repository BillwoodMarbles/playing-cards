export interface Card {
  id: number;
  suit: number;
  value: number;
}

export type GameStatus = "open" | "in-progress" | "finished";
