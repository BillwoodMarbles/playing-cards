import { useState } from "react";
import { Game, Player } from "../types";
import { GameClass } from "../classes/Game";
import { v4 as UUID } from "uuid";
import { getNextPlayer } from "../utils/game";

const useGame = (player: Player | null) => {
  const [game, setGame] = useState<Game>(new GameClass());

  const addPlayer = (
    playerName: string,
    type: "host" | "player" = "player"
  ) => {
    const newGame = { ...game };

    const newPlayer: Player = {
      score: 0,
      name: playerName,
      cards: [],
      id: UUID(),
      type,
    };
    newGame.players.push(newPlayer);

    newGame.lastMove = {
      playerId: newPlayer.id,
      action: "player-join",
      card: null,
    };

    setGame(newGame);
    return { gameData: newGame, player: newPlayer };
  };

  const claimRound = (): Game => {
    const newGame = { ...game };

    newGame.rounds[newGame.currentRound].roundWinner = newGame.playerTurn;
    newGame.rounds[newGame.currentRound].status = "last-turn";
    newGame.playerTurn = getNextPlayer(game)?.id || game.playerTurn;

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "claim-round",
      card: null,
    };

    setGame(newGame);
    return newGame;
  };

  return {
    game,
    setGame,
    addPlayer,
    claimRound,
  };
};

export default useGame;
