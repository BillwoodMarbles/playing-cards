import { GameTypes } from "../data/game-configs";
import { Game, PLAYER_ACTION, PlayerAction } from "../types";

export const getNextAction = (
  game: Game,
  playerActions: PlayerAction[],
  playerId?: string
): PlayerAction | null => {
  if (game.gameType === GameTypes.GRANDMA) {
    return getNextGrandmaAction(game, playerActions, playerId);
  }

  if (game.gameType === GameTypes.MINI_GOLF) {
    return getNextMiniGolfAction(game, playerActions, playerId);
  }

  if (game.gameType === GameTypes.CARD_PARTY) {
    return getNextCardPartyAction(game, playerActions, playerId);
  }

  return getNextDefaultAction(game, playerActions, playerId);
};

const getNextDefaultAction = (
  game: Game,
  playerActions: PlayerAction[],
  playerId?: string
): PlayerAction | null => {
  const lastAction = playerActions[playerActions.length - 1];

  // not player turn
  if (game.playerTurn !== playerId) {
    return null;
  }

  // first action
  if (!lastAction) {
    return {
      availableActions: [PLAYER_ACTION.DRAW],
      description: "Draw card from deck or discard pile",
      actionTaken: null,
    };
  }

  // validate previous action completed
  if (!lastAction.actionTaken) {
    console.error("getNextAction called without completing current action");
    return null;
  }

  if (lastAction.actionTaken === PLAYER_ACTION.DRAW) {
    return {
      availableActions: [PLAYER_ACTION.DISCARD],
      description: "Discard",
      actionTaken: null,
    };
  }

  if (lastAction.actionTaken === PLAYER_ACTION.DISCARD) {
    return {
      availableActions: [PLAYER_ACTION.END_TURN],
      description: "End turn",
      actionTaken: null,
    };
  }

  if (
    lastAction.actionTaken === PLAYER_ACTION.END_TURN ||
    lastAction.actionTaken === PLAYER_ACTION.CLAIM_ROUND
  ) {
    return {
      availableActions: [PLAYER_ACTION.CLEAR_TURNS],
      description: "Exlaim GRANDMA or discard",
      actionTaken: null,
    };
  }

  return playerActions[playerActions.length - 1];
};

const getNextGrandmaAction = (
  game: Game,
  playerActions: PlayerAction[],
  playerId?: string
): PlayerAction | null => {
  const lastAction = playerActions[playerActions.length - 1];

  // not player turn
  if (game.playerTurn !== playerId) {
    return null;
  }

  // first action
  if (!lastAction) {
    return {
      availableActions: [PLAYER_ACTION.DRAW],
      description: "Draw card from deck or discard pile",
      actionTaken: null,
    };
  }

  // validate previous action completed
  if (!lastAction.actionTaken) {
    console.error("getNextAction called without completing current action");
    return null;
  }

  if (lastAction.actionTaken === PLAYER_ACTION.DRAW) {
    return {
      availableActions: [PLAYER_ACTION.DISCARD],
      description: "Discard",
      actionTaken: null,
    };
  }

  if (
    lastAction.actionTaken === PLAYER_ACTION.DISCARD ||
    lastAction.actionTaken === PLAYER_ACTION.DISCARD_DRAWN_CARD
  ) {
    let newAvailableActions = [PLAYER_ACTION.END_TURN];

    if (!game.rounds[game.currentRound].roundWinner) {
      newAvailableActions.push(PLAYER_ACTION.CLAIM_ROUND);
    }

    return {
      availableActions: newAvailableActions,
      description: "End turn",
      actionTaken: null,
    };
  }

  if (
    lastAction.actionTaken === PLAYER_ACTION.END_TURN ||
    lastAction.actionTaken === PLAYER_ACTION.CLAIM_ROUND
  ) {
    return {
      availableActions: [PLAYER_ACTION.CLEAR_TURNS],
      description: "Exlaim GRANDMA or discard",
      actionTaken: null,
    };
  }

  return playerActions[playerActions.length - 1];
};

const getNextMiniGolfAction = (
  game: Game,
  playerActions: PlayerAction[],
  playerId?: string
): PlayerAction | null => {
  const lastAction = playerActions[playerActions.length - 1];

  // not player turn
  if (game.playerTurn !== playerId) {
    return null;
  }

  // first action
  if (!lastAction) {
    if (game.rounds[game.currentRound].turnCount === 0) {
      return {
        availableActions: [PLAYER_ACTION.PEEK],
        description: "Peek at 2 cards",
        actionTaken: null,
      };
    }

    return {
      availableActions: [PLAYER_ACTION.DRAW],
      description: "Draw card from deck or discard pile",
      actionTaken: null,
    };
  }

  // validate previous action completed
  if (!lastAction.actionTaken) {
    console.error("getNextAction called without completing current action");
    return null;
  }

  if (lastAction.actionTaken === PLAYER_ACTION.START_TURN) {
    return {
      availableActions: [PLAYER_ACTION.DRAW],
      description: "Draw card from deck or discard pile",
      actionTaken: null,
    };
  }

  if (lastAction.actionTaken === PLAYER_ACTION.DRAW) {
    return {
      availableActions: [PLAYER_ACTION.DISCARD],
      description: "Discard",
      actionTaken: null,
    };
  }

  if (lastAction.actionTaken === PLAYER_ACTION.DISCARD_DRAWN_CARD) {
    return {
      availableActions: [PLAYER_ACTION.REVEAL_CARD],
      description: "Reveal card",
      actionTaken: null,
    };
  }

  if (
    lastAction.actionTaken === PLAYER_ACTION.DISCARD ||
    lastAction.actionTaken === PLAYER_ACTION.REVEAL_CARD
  ) {
    return {
      availableActions: [PLAYER_ACTION.END_TURN],
      description: "End turn",
      actionTaken: null,
    };
  }

  if (lastAction.actionTaken === PLAYER_ACTION.END_TURN) {
    return {
      availableActions: [PLAYER_ACTION.CLEAR_TURNS],
      description: "Exlaim GRANDMA or discard",
      actionTaken: null,
    };
  }

  return playerActions[playerActions.length - 1];
};

const getNextCardPartyAction = (
  game: Game,
  _playerActions: PlayerAction[],
  playerId?: string
): PlayerAction | null => {
  // first action
  return {
    availableActions: [PLAYER_ACTION.REVEAL_CARD],
    description: "Draw a card",
    actionTaken: null,
  };
};
