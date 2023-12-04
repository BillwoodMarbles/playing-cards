import { GameConfig, PlayerActions, Round } from "../types";

export const PLAYER_ACTIONS: { [key in PlayerActions]: any } = {
  [PlayerActions.DRAW]: {
    type: PlayerActions.DRAW,
    completed: false,
    description: "Draw a card from the deck or discard pile",
  },
  [PlayerActions.DISCARD]: {
    type: PlayerActions.DISCARD,
    completed: false,
    description: "Discard a card",
  },
  [PlayerActions.REVEAL_CARD]: {
    type: PlayerActions.REVEAL_CARD,
    completed: false,
    description: "Reveal a card",
  },
  [PlayerActions.PEEK]: {
    type: PlayerActions.PEEK,
    completed: false,
    description: "Peek at card",
  },
};

export enum GameTypes {
  FREE_PLAY = "free-play",
  GRANDMA = "grandma",
  MINI_GOLF = "mini-golf",
}

export const GRANDMA_GAME_CONFIG = (): GameConfig => {
  return {
    id: 1,
    rounds: buildGrandmaRounds(),
    minPlayers: 2,
    maxPlayers: 8,
    type: GameTypes.GRANDMA,
    name: "Grandma!",
    deckCount: 2,
    deckType: "standard-with-jokers",
    pointCount: 5,
  };
};

export const MINI_GOLF_GAME_CONFIG = (): GameConfig => {
  return {
    id: 1,
    rounds: buildMiniGolfRounds(),
    minPlayers: 2,
    maxPlayers: 8,
    type: GameTypes.MINI_GOLF,
    name: "Mini Golf",
    deckCount: 1,
    deckType: "standard-with-jokers",
    pointCount: 1,
  };
};

const buildMiniGolfRounds = () => {
  const rounds: Round[] = [];
  for (let i = 0; i < 9; i++) {
    const playerActions = [];

    playerActions.push({
      ...PLAYER_ACTIONS[PlayerActions.PEEK],
      preRound: true,
    });
    playerActions.push(PLAYER_ACTIONS[PlayerActions.DRAW]);
    playerActions.push(PLAYER_ACTIONS[PlayerActions.DISCARD]);

    rounds.push({
      id: i,
      status: "open",
      score: {},
      drawCount: 4,
      roundWinner: "",
      dealer: "",
      maxTurns: 4,
      turnCount: 0,
      playerActions,
    });
  }
  return rounds;
};

const buildGrandmaRounds = () => {
  const rounds: Round[] = [];
  for (let i = 0; i < 11; i++) {
    rounds.push({
      id: i,
      status: "open",
      score: {},
      drawCount: i + 3,
      roundWinner: "",
      dealer: "",
      turnCount: 0,
      playerActions: [
        PLAYER_ACTIONS[PlayerActions.DRAW],
        PLAYER_ACTIONS[PlayerActions.DISCARD],
      ],
    });
  }
  return rounds;
};

export const getGameConfig = (gameType?: GameTypes) => {
  switch (gameType) {
    case GameTypes.GRANDMA:
      return GRANDMA_GAME_CONFIG();
    case GameTypes.MINI_GOLF:
      return MINI_GOLF_GAME_CONFIG();
    default:
      return GRANDMA_GAME_CONFIG();
  }
};
