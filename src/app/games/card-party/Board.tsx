import Deck from "@/app/components/Deck";
import Header from "@/app/components/Header";
import GameNotifications from "@/app/components/Notifications";
import { useGame as GameContext } from "@/app/contexts/GameContext";
import { usePlayer } from "@/app/contexts/PlayerContext";
import useAnimations from "@/app/hooks/useAnimations";
import useGame from "@/app/hooks/useGame";
import { Card, PLAYER_ACTION } from "@/app/types";
import { FC } from "react";

const PartyBoard: FC = () => {
  const { game, gameConfig, myPlayer, updateGameState } = GameContext();
  const {
    burnCardFromPrimaryDeck,
    revealCard: RevealCard,
    startGame: StartGame,
  } = useGame(game, myPlayer);

  const { currentAction, completeAction } = usePlayer();
  const { getDeckAnimation } = useAnimations(game, myPlayer);

  const topCard = game.deck[game.deck.length - 1];

  const revealCard = (card: Card) => {
    const newGame = RevealCard(card);
    updateGameState(newGame);
    completeAction(PLAYER_ACTION.REVEAL_CARD);
  };

  const burdCard = () => {
    const newGame = burnCardFromPrimaryDeck();
    updateGameState(newGame);
    completeAction(PLAYER_ACTION.DRAW);
  };

  const startGame = () => {
    try {
      const newGame = StartGame();
      updateGameState(newGame);
    } catch (err) {
      console.error("error starting game", err);
    }
  };

  const showBurnCardCTA = () => {
    return topCard?.status === "visible";
  };

  const showStartGameCTA = () => {
    return (
      game.status === "open" &&
      myPlayer?.type === "host" &&
      game.players.length >= gameConfig.minPlayers
    );
  };

  return (
    <>
      <Header game={game} gameConfig={gameConfig} />

      <GameNotifications />

      <div className="flex items-center justify-center grow relative flex-col w-full bg-slate-100 py-6">
        <div className="flex mb-6 justify-center flex-col">
          <div className="mb-4">
            <Deck
              size="full"
              cards={game.deck}
              enabled={Boolean(
                currentAction?.availableActions.includes(
                  PLAYER_ACTION.REVEAL_CARD
                )
              )}
              onClick={revealCard}
              animation={getDeckAnimation("deck")}
            />
          </div>
        </div>
      </div>

      <div className="pb-4 bg-slate-100 w-full grow-0 relative z-20">
        <div className="flex justify-center absolute left-0 bottom-full w-full">
          {showStartGameCTA() && (
            <button
              className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
              onClick={startGame}
            >
              Start Game
            </button>
          )}

          {showBurnCardCTA() && (
            <button
              className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
              onClick={burdCard}
            >
              Discard
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PartyBoard;
