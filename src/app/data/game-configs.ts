import { Round } from "../types";

export const GRANDMA_GAME_TYPE = "grandma";

export const GRANDMA_GAME_CONFIG = () => {
  return {
    id: 1,
    rounds: buildGrandmaRounds(),
    minPlayers: 2,
    maxPlayers: 10,
    type: GRANDMA_GAME_TYPE,
  };
};

const buildGrandmaRounds = () => {
  const rounds: Round[] = [];
  for (let i = 0; i < 10; i++) {
    rounds.push({
      id: i,
      status: "open",
      score: {},
      drawCount: i + 3,
      roundWinner: -1,
      dealer: -1,
    });
  }
  return rounds;
};

export const getGameConfig = (gameType: string) => {
  switch (gameType) {
    case GRANDMA_GAME_TYPE:
      return GRANDMA_GAME_CONFIG();
    default:
      return GRANDMA_GAME_CONFIG();
  }
};
