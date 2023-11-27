"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createGame } from "@/graphql/mutations";
import { CreateGameInput } from "@/API";
import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplifyconfiguration.json";
Amplify.configure(amplifyconfig);

const client = generateClient();

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

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
