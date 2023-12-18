import { FC, createContext, useContext, useEffect, useState } from "react";
import { Game, GameConfig, Player, Round } from "../types";
import { v4 as UUID } from "uuid";
import { getCurrentRound } from "../utils/game";
import { generateClient } from "aws-amplify/api";
import { updateGame } from "@/graphql/mutations";
import { GameTypes, getGameConfig } from "../data/game-configs";
import { getPlayerById } from "../utils/player";

const client = generateClient();

const initialContext: {
  currentRound: Round | null;
  game: Game;
  gameConfig: GameConfig;
  myPlayer: Player | null;
  isMyTurn: () => boolean;
  addPlayer: (playerName: string) => Player | void;
  updateGameState: (game: Game, skipDataSync?: boolean) => void;
} = {
  currentRound: null,
  game: {
    id: "",
    code: "",
    players: [],
    gameType: GameTypes.GRANDMA,
    rounds: [],
    deck: [],
    discardDeck: [],
    playerTurn: "",
    status: "open",
    currentRound: 0,
    lastMove: null,
    mode: "online",
  },
  gameConfig: getGameConfig(),
  myPlayer: null,
  isMyTurn: () => false,
  addPlayer: (playerName: string) => {},
  updateGameState: (game: Game) => {},
};

const MyGameContext = createContext(initialContext);

interface GameContextProps {
  initialGame: Game;
  playerId?: string;
  children: React.ReactNode;
}

export const GameContext: FC<GameContextProps> = ({
  children,
  playerId,
  initialGame,
}) => {
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [game, setGame] = useState<Game>(initialGame);
  const [gameConfig, setGameConfig] = useState<GameConfig>(getGameConfig());

  const currentRound = getCurrentRound(game);

  const isMyTurn = () => {
    if (game && playerId !== null) {
      return game.playerTurn === playerId;
    }

    return false;
  };

  const updateGameGQL = async (game: Game) => {
    try {
      await client.graphql({
        query: updateGame,
        variables: {
          input: {
            id: game.id,
            code: game.code,
            players: JSON.stringify(game.players),
            deck: JSON.stringify(game.deck),
            discardDeck: JSON.stringify(game.discardDeck),
            playerTurn: game.playerTurn,
            status: game.status,
            rounds: JSON.stringify(game.rounds),
            currentRound: game.currentRound,
            lastMove: JSON.stringify(game.lastMove),
          },
        },
      });
    } catch (err) {
      console.error("error updating game", err);
    }
  };

  const updateGameState = (
    updatedData: Partial<Game>,
    skipDataSync?: boolean
  ) => {
    const newGame = { ...game, ...updatedData };

    if (newGame.mode === "online" && !skipDataSync) {
      updateGameGQL(newGame);
    }

    localStorage.setItem("game", JSON.stringify(newGame));
    setGame(newGame);
  };

  const addPlayer = (
    playerName: string,
    type: "host" | "player" = "player"
  ) => {
    const newGame = { ...game };

    const newPlayer: Player = {
      score: 0,
      name: playerName,
      cards: [],
      id: UUID(),
      type,
    };
    newGame.players.push(newPlayer);

    newGame.lastMove = {
      playerId: newPlayer.id,
      action: "player-join",
      card: null,
    };

    updateGameState(newGame);

    return newPlayer;
  };

  useEffect(() => {
    if (initialGame) {
      setGame(initialGame);
    }
  }, [initialGame]);

  useEffect(() => {
    if (playerId) {
      setMyPlayer(getPlayerById(game, playerId));
    }
  }, [game, playerId]);

  useEffect(() => {
    if (game) {
      setGameConfig(getGameConfig(game.gameType));
    }
  }, [game]);

  return (
    <MyGameContext.Provider
      value={{
        currentRound,
        game,
        gameConfig,
        myPlayer,
        addPlayer,
        isMyTurn,
        updateGameState,
      }}
    >
      {children}
    </MyGameContext.Provider>
  );
};

export const useGame = () => useContext(MyGameContext);
