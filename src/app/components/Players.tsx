import { FC } from "react";
import { Player } from "../types";

interface PlayersProps {
  players: Player[];
  playerTurn: number;
}

const Players: FC<PlayersProps> = ({ players, playerTurn }) => {
  return (
    <div className="py-4 px-3 bg-slate-100 border-b-2 border-b-white w-full">
      <ul className="flex justify-center">
        {players.map((player) => {
          return (
            <li key={player.id} className="mx-1">
              <div
                className={`rounded-full border-2 flex items-center justify-center transform ease-in-out duration-100 h-14 w-14 ${
                  playerTurn === player.id
                    ? "border-green-600 bg-green-200 scale-110"
                    : "border-gray-600 bg-gray-200"
                }`}
              >
                <div
                  className={`rounded-lg flex items-center justify-center py-0 px-1 text-xs`}
                >
                  {player.name}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Players;
