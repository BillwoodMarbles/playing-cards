import { FC } from "react";
import { Player } from "../types";

interface PlayersProps {
  players: Player[];
  playerTurn: string;
}

const Players: FC<PlayersProps> = ({ players, playerTurn }) => {
  return (
    <ul className="flex justify-center">
      {players.map((player) => {
        return (
          <li key={player.id} className="mx-1">
            <div
              className={`rounded-full border-2 flex items-center justify-center transform ease-in-out duration-100 h-12 w-12 ${
                playerTurn === player.id
                  ? "border-teal-600 bg-teal-300 scale-110"
                  : "border-gray-600 bg-gray-1000"
              }`}
            >
              <div
                className={`rounded-lg flex items-center justify-center py-0 px-1 text-xs text-center`}
              >
                {player.name}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Players;
