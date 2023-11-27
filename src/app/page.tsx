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

  const rounds: Round[] = [
    {
      id: 0,
      status: "in-progress",
      score: {},
      drawCount: 3,
      roundWinner: -1,
    },
    {
      id: 1,
      status: "in-progress",
      score: {},
      drawCount: 4,
      roundWinner: -1,
    },
    {
      id: 2,
      status: "in-progress",
      score: {},
      drawCount: 5,
      roundWinner: -1,
    },
  ];

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
    <section className="w-full">
      <h1 className="text-4xl mb-6">Card Night</h1>

      <div>
        <form onSubmit={onCreateGame}>
          <div className="mb-4">
            <label>
              Player Name:
              <input
                type="text"
                value={playerName}
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
  );
}
