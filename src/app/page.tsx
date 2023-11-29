"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createGame } from "@/graphql/mutations";
import { CreateGameInput } from "@/API";
import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplifyconfiguration.json";
import { Round } from "./types";
Amplify.configure(amplifyconfig);

const client = generateClient();

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  const buildDefaultRounds = () => {
    const rounds: Round[] = [];
    for (let i = 0; i < 10; i++) {
      rounds.push({
        id: i,
        status: "open",
        score: {},
        drawCount: i + 3,
        roundWinner: -1,
        dealer: -1,
      });
    }
    return rounds;
  };
  const rounds = buildDefaultRounds();

  const onCreateGame = async (e: any) => {
    e.preventDefault();
    const code = Math.random().toString(36).substring(2, 6);

    try {
      await client.graphql({
        query: createGame,
        variables: {
          input: {
            id: code,
            code,
            players: JSON.stringify([
              { id: 0, name: playerName, cards: [], type: "host" },
            ]),
            deck: JSON.stringify([]),
            discardDeck: JSON.stringify([]),
            playerTurn: 0,
            status: "open",
            rounds: JSON.stringify(rounds),
            currentRound: 0,
            gameType: "grandma",
          } as CreateGameInput,
        },
      });

      router.push(`/play?code=${code}&player=${playerName}`);
    } catch (err) {
      console.log("error creating game");
    }
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
            <button
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
