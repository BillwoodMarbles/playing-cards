import { FC } from "react";
import { getCurrentRoundWinner } from "../utils/game";
import { Game } from "../types";
import { GameTypes } from "../data/game-configs";

interface PlayerCTAsProps {
  game: Game;
  onClaimRound: () => void;
  onEndTurn: () => void;
}

const PlayerCTAs: FC<PlayerCTAsProps> = ({ game, onClaimRound, onEndTurn }) => {
  const showClaimRoundCTA = () => {
    return game.gameType === GameTypes.GRANDMA && !getCurrentRoundWinner(game);
  };

  return (
    <div className="flex justify-center">
      {showClaimRoundCTA() && (
        <button
          className="px-6 py-2 mb-2 mx-1 bg-red-300 rounded-md shadow-md"
          onClick={onClaimRound}
        >
          GRANDMA!!!
        </button>
      )}

      <button
        className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
        onClick={onEndTurn}
      >
        End Turn
      </button>
    </div>
  );
};

export default PlayerCTAs;
