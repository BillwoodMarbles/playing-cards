"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createGame } from "@/graphql/mutations";
import { CreateGameInput } from "@/API";
import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplifyconfiguration.json";
import { GameClass } from "./classes/Game";
import { GameTypes, getGameConfig } from "./data/game-configs";
import { v4 as UUID } from "uuid";

Amplify.configure(amplifyconfig);
const client = generateClient();

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameType, setGameType] = useState<GameTypes>(GameTypes.GRANDMA);
  const [roundCount, setRoundCount] = useState(
    getGameConfig(gameType).rounds.length.toString()
  );

  const onCreateGame = async (e: any) => {
    e.preventDefault();
    const code = Math.random().toString(36).substring(2, 6);

    const newGame = new GameClass({
      id: code,
      code,
      players: [
        { id: UUID(), name: playerName, cards: [], type: "host", score: 0 },
      ],
      gameType,
    });

    if (roundCount) {
      newGame.rounds = getGameConfig(gameType).rounds.slice(
        0,
        parseInt(roundCount)
      );
    }

    try {
      await client.graphql({
        query: createGame,
        variables: {
          input: {
            id: newGame.code,
            code: newGame.code,
            players: JSON.stringify(newGame.players),
            deck: JSON.stringify(newGame.deck),
            discardDeck: JSON.stringify(newGame.discardDeck),
            playerTurn: newGame.playerTurn,
            status: newGame.status,
            rounds: JSON.stringify(newGame.rounds),
            currentRound: newGame.currentRound,
            gameType: newGame.gameType,
          } as CreateGameInput,
        },
      });

      localStorage.setItem("playerId", newGame.players[0].id);
      router.push(`/play?code=${code}&playerId=${newGame.players[0].id}`);
    } catch (err) {
      console.log("error creating game");
    }
  };

  const changeGameType = (gameTypeValue: string) => {
    const gameType = gameTypeValue as GameTypes;
    setGameType(gameType);
    setRoundCount(getGameConfig(gameType).rounds.length.toString());
  };

  return (
    <>
      <header className="w-full flex justify-center items-center py-2">
        <div className="flex items-center">
          <h1 className="text-2xl">Card Night</h1>
        </div>
      </header>

      <section className="w-full py-4 px-2 bg-slate-100 grow text-center">
        <div className="max-w-xs mx-auto">
          <form onSubmit={onCreateGame}>
            <div className="mb-4">
              <label>
                <input
                  className="w-full px-3 py-2 border border-gray-400 rounded-md"
                  type="text"
                  value={playerName}
                  placeholder="Player Name"
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label>
                <select
                  className="w-full px-3 py-2 border border-gray-400 rounded-md"
                  value={gameType}
                  placeholder="Game Type"
                  onChange={(e) => changeGameType(e.target.value)}
                >
                  <option value={GameTypes.GRANDMA}>Grandma</option>
                  <option value={GameTypes.MINI_GOLF}>Mini Golf</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label>
                <input
                  className="w-full px-3 py-2 border border-gray-400 rounded-md"
                  type="number"
                  value={roundCount}
                  placeholder="Rounds"
                  onChange={(e) => setRoundCount(e.target.value)}
                />
              </label>
            </div>
            <button
              disabled={playerName.length === 0}
              type="submit"
              className="px-6 py-2 mb-5 bg-blue-300 rounded-md"
              onClick={onCreateGame}
            >
              Create Game
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
