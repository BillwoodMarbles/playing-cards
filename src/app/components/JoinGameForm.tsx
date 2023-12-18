import { FC, useState } from "react";
import { useGame } from "../contexts/GameContext";
import { useRouter } from "next/navigation";

interface JoinGameFormProps {}

const JoinGameForm: FC<JoinGameFormProps> = () => {
  const [playerName, setPlayerName] = useState("");

  const router = useRouter();
  const { game, addPlayer } = useGame();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const player = addPlayer(playerName);
    router.push(`/play?code=${game?.code}&playerId=${player?.id}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex">
        <label className="mr-1">
          <input
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
            type="text"
            value={playerName}
            placeholder="Player Name"
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>

        <button
          disabled={playerName.length === 0}
          className="px-6 py-2 mb-5 bg-blue-300 rounded-md shadow-md"
          type="submit"
        >
          Join Game
        </button>
      </div>
    </form>
  );
};
export default JoinGameForm;
