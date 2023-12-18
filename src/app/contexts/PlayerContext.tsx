import { FC, createContext, useContext, useEffect, useState } from "react";
import { Game, PLAYER_ACTION, PlayerAction } from "../types";
import { getNextAction } from "../utils/actions";
import { useGame } from "./GameContext";

const initialContext: {
  currentAction: PlayerAction | null;
  playerActions: PlayerAction[];
  resetActions: () => void;
  completeAction: (action: PLAYER_ACTION) => void;
} = {
  currentAction: null,
  playerActions: [],
  resetActions: () => {},
  completeAction: (action: PLAYER_ACTION) => {},
};

const MyPlayerContext = createContext(initialContext);

interface PlayerContextProps {
  children: React.ReactNode;
  playerId: string;
}

export const PlayerContext: FC<PlayerContextProps> = ({
  children,
  playerId,
}) => {
  const { game } = useGame();
  const [playerActions, setPlayerActions] = useState<PlayerAction[]>([]);
  const [currentAction, setCurrentAction] = useState<PlayerAction | null>(null);

  const completeAction = (actionTaken: PLAYER_ACTION) => {
    if (!currentAction) {
      return;
    }
    const completedAction = { ...currentAction };
    completedAction.actionTaken = actionTaken;

    localStorage.setItem(
      "playerActions",
      JSON.stringify([...playerActions, completedAction])
    );
    setPlayerActions((prevValue) => [...prevValue, completedAction]);
  };

  const resetActions = () => {
    setPlayerActions([]);
    localStorage.setItem("playerActions", JSON.stringify([]));
  };

  useEffect(() => {
    const _currentAction = getNextAction(game, playerActions, playerId);
    console.log("Setting current action", _currentAction);
    setCurrentAction(_currentAction);
  }, [playerActions, game]);

  useEffect(() => {
    const localPlayerActions = JSON.parse(
      localStorage.getItem("playerActions") || "[]"
    );

    setPlayerActions(localPlayerActions);
  }, []);

  return (
    <MyPlayerContext.Provider
      value={{
        currentAction,
        playerActions,
        resetActions,
        completeAction,
      }}
    >
      {children}
    </MyPlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(MyPlayerContext);
