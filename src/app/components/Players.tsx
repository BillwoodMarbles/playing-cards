import { FC } from "react";
import { Player } from "../types";
import { useRouter } from "next/navigation";
import { useGame } from "../contexts/GameContext";

interface PlayersProps {
  players: Player[];
  playerTurn: string;
}

const Players: FC<PlayersProps> = ({ players, playerTurn }) => {
  const router = useRouter();
  const { game } = useGame();

  const playerClick = (playerId: string) => {
    if (game.mode === "local") {
      // push current route with playerId of clicked player
      router.push(`/play?code=${game.code}&playerId=${playerId}`);
    }
  };

  const getPlayerInitials = (name: string) => {
    const names = name.split(" ");

    if (names.length > 1 && names[1] !== "") {
      return `${names[0][0]}${names[1][0]}`;
    }

    return `${names[0][0]}`;
  };

  const getPlayerColorByIndex = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-cyan-500",
    ];

    const newIndex = index % colors.length;

    return colors[newIndex];
  };

  return (
    <ul className="flex justify-center">
      {players.map((player, index) => {
        return (
          <li key={player.id} className="mx-1 relative">
            {playerTurn === player.id && (
              <div className="w-full absolute left-0 top-0 h-full z-0 flex justify-center items-center">
                <div className="w-2/3 h-2/3 bg-blue-500 animate-ping rounded-full"></div>
              </div>
            )}
            <div
              className={`rounded-full border-2 border-white flex items-center justify-center transform ease-in-out duration-100 h-12 w-12 ${getPlayerColorByIndex(
                index
              )}`}
              onClick={() => playerClick(player.id)}
            >
              <div
                className={`relative z-10 rounded-lg flex items-center justify-center py-0 px-1 text-base text-center text-white`}
              >
                {getPlayerInitials(player.name)}
              </div>

              <div className="border-2 rounded-full w-6 h-6 absolute -bottom-2 -right-2 text-xs text-center leading-none flex items-center justify-center bg-white">
                {player.score || 0}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Players;
