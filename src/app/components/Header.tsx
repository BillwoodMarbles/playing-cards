import { FC } from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { Game, GameConfig } from "../types";

interface HeaderProps {
  game: Game;
  gameConfig: GameConfig;
}

const Header: FC<HeaderProps> = ({ game, gameConfig }) => {
  const currentRound = game?.rounds[game?.currentRound];

  const copyCurrentRouteToClipboard = () => {
    let path = window.location.href.split("?")[0];
    path += `?code=${game?.code}`;
    navigator.clipboard.writeText(path);
  };

  return (
    <header className="px-4 py-3 flex items-center w-full">
      <div className="w-1/4">
        <button
          className="ml-2 flex items-center"
          onClick={copyCurrentRouteToClipboard}
        >
          {game?.code}
          <FaShareFromSquare className="ml-2" />
        </button>
      </div>
      <div className="text-center grow">
        <h1 className="text-2xl">{gameConfig.name}</h1>
        {currentRound && (
          <p className="text-xs">
            (round {currentRound.id >= 0 ? currentRound.id + 1 : "-"} of{" "}
            {game?.rounds.length} - turn {(currentRound.turnCount || 0) + 1} of{" "}
            {currentRound.maxTurns || "∞"})
          </p>
        )}
      </div>

      <div className="w-1/4 flex justify-end"></div>
    </header>
  );
};

export default Header;
