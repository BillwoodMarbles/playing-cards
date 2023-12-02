import { Game, Player, PlayerAction } from "../types";

export const getPlayerById = (game: Game | null, playerId?: string) => {
  if (game === null || !playerId) return null;
  return game.players.find((player) => player.id === playerId) || null;
};

export const getPlayerIndexById = (game: Game | null, playerId: string) => {
  if (game === null || !playerId) return null;
  return game.players.findIndex((player) => player.id === playerId);
};

export const getCurrentAction = (playerActions: PlayerAction[]) => {
  if (playerActions) {
    return playerActions.find((action) => !action.completed);
  }
};

export const sortPlayerCards = (game: Game | null, player: Player) => {
  let sortedCards = [...player.cards];

  const prevPlayerData = game?.players.find(
    (prevPlayer) => prevPlayer.id === player.id
  );
  const sortingArr = prevPlayerData?.cards.map((card) => card.id);

  if (sortingArr) {
    sortedCards = sortedCards.sort(function (a, b) {
      return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
    });
  }

  return sortedCards;
};
