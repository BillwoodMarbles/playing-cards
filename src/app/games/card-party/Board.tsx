import Deck from "@/app/components/Deck";
import Header from "@/app/components/Header";
import GameNotifications from "@/app/components/Notifications";
import { useGame as GameContext } from "@/app/contexts/GameContext";
import { usePlayer } from "@/app/contexts/PlayerContext";
import { getGameConfig } from "@/app/data/game-configs";
import {
  MiniGameRequirements,
  MiniGameType,
  getMiniGameByTitle,
  getPartyCardDeckWithConfig,
  getRequirementIcon,
  partyCards,
} from "@/app/data/party-cards";
import useAnimations from "@/app/hooks/useAnimations";
import useGame from "@/app/hooks/useGame";
import { Card, PLAYER_ACTION, Round } from "@/app/types";
import { shuffleCards } from "@/app/utils/cards";
import { FC, useState } from "react";
import { CgCardSpades } from "react-icons/cg";
import { FaCoins, FaDice, FaPencilAlt, FaRunning } from "react-icons/fa";
import { GiGlassShot } from "react-icons/gi";
import { IoBeer } from "react-icons/io5";

const PartyBoard: FC = () => {
  const { game, gameConfig, myPlayer, updateGameState } = GameContext();
  const {
    burnCardFromPrimaryDeck,
    revealCard: RevealCard,
    startGame: StartGame,
  } = useGame(game, myPlayer);

  const { currentAction, completeAction } = usePlayer();
  const { getDeckAnimation } = useAnimations(game, myPlayer);
  const [requirementToggles, setRequirementToggles] = useState<
    { requirement: MiniGameRequirements; toggled: boolean }[]
  >([
    { requirement: "none", toggled: true },
    { requirement: "dice", toggled: true },
    { requirement: "cards", toggled: true },
    { requirement: "coins", toggled: true },
    { requirement: "shot-glass", toggled: true },
    { requirement: "standing", toggled: true },
    { requirement: "drinking", toggled: true },
    { requirement: "drawing", toggled: true },
  ]);

  const buildCardList = () => {
    const cardList: { [key in MiniGameType]?: boolean } = {};

    partyCards.forEach((card) => {
      cardList[card.title] = true;
    });

    return cardList;
  };

  const [cardList, setCardList] = useState<{ [key in MiniGameType]?: boolean }>(
    buildCardList()
  );

  const topCard = game.deck[game.deck.length - 1];

  const revealCard = (card: Card) => {
    const newGame = RevealCard(card);
    updateGameState(newGame);
    completeAction(PLAYER_ACTION.REVEAL_CARD);
  };

  const getCountOfAllToggledGames = () => {
    return Object.values(cardList).filter((item) => item).length;
  };

  const burdCard = () => {
    const newGame = burnCardFromPrimaryDeck();
    updateGameState(newGame);
    completeAction(PLAYER_ACTION.DRAW);
  };

  const startGame = () => {
    try {
      const newGame = { ...game };
      const gameConfig = getGameConfig(newGame.gameType);

      // validate
      if (game.players.length < gameConfig.minPlayers) {
        alert(
          `You need at least ${gameConfig.minPlayers} players to start a game`
        );
        throw new Error("Not enough players to start game");
      }
      if (game.players.length > gameConfig.maxPlayers) {
        alert(
          `You can only have ${gameConfig.maxPlayers} players to start a game`
        );
        throw new Error("Too many players to start game");
      }

      // start game
      if (!newGame.rounds.length) {
        const rounds: Round[] = [];
        for (let i = 0; i < 1; i++) {
          rounds.push({
            id: i,
            status: "open",
            score: {},
            drawCount: 0,
            roundWinner: "",
            dealer: "",
            turnCount: 0,
          });
        }
        newGame.rounds = rounds;
      }

      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length;
      newGame.deck = shuffleCards(getPartyCardDeckWithConfig(cardList));
      newGame.discardDeck = [];

      // set round status to open
      const newRounds = [...newGame.rounds];
      newRounds[newGame.currentRound].status = "open";

      // set dealer to player based on current round
      const dealerIndex = newGame.currentRound % newGame.players.length;
      const currentDealer = newGame.players[dealerIndex];
      newRounds[newGame.currentRound].dealer = currentDealer.id;
      newGame.rounds = newRounds;

      // update current player turn to next player in line
      const nextPlayerIndex = (dealerIndex + 1) % newGame.players.length;
      const nextPlayer = newGame.players[nextPlayerIndex];
      newGame.playerTurn = nextPlayer.id;
      newGame.status = "in-progress";

      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "new-game",
        card: null,
      };

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

  const getRequirementIconComponent = (item: {
    requirement: MiniGameRequirements;
    toggled?: boolean;
  }) => {
    const IconComponent = getRequirementIcon(item.requirement);
    if (!IconComponent) {
      return null;
    }
    return <IconComponent className={item.toggled ? "text-white" : ""} />;
  };

  const getGamesList = () => {
    const gamesByRequirement = Object.keys(cardList).reduce((acc, key) => {
      const miniGame = getMiniGameByTitle(key as MiniGameType);
      if (miniGame === undefined) {
        return acc;
      }

      // merge requirements into one string
      const requirement = miniGame.requirements?.join("-");

      if (requirement) {
        if (!acc[requirement]) {
          acc[requirement] = [];
        }

        acc[requirement].push(miniGame);
      } else {
        if (!acc["none"]) {
          acc["none"] = [];
        }

        acc["none"].push(miniGame);
      }

      return acc;
    }, {} as { [key: string]: typeof partyCards });

    // sort by mini game title
    Object.entries(gamesByRequirement).forEach(([requirement, miniGames]) => {
      miniGames.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }

        if (a.title > b.title) {
          return 1;
        }

        return 0;
      });
    });

    return Object.entries(gamesByRequirement).map(
      ([requirement, miniGames]) => (
        <div key={requirement}>
          <hr className="border-gray-400" />
          {miniGames.map((miniGame) => (
            <div
              key={miniGame.title}
              className="flex justify-between py-2 border-b items-center"
            >
              <div>{miniGame.title}</div>

              <div className="flex items-center">
                <div className="h-full flex items-center px-4">
                  {miniGame.requirements?.map((line, index) => (
                    <div
                      key={index}
                      className="rounded-full border-2 border-gray-400 h-8 w-8 text-lg ml-1 flex items-center justify-center"
                    >
                      {getRequirementIconComponent({ requirement: line })}
                    </div>
                  ))}
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="mini-game"
                    checked={cardList[miniGame.title]}
                    className="mr-2"
                    onChange={() => {
                      setCardList({
                        ...cardList,
                        [miniGame.title]: !cardList[miniGame.title],
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  const toggleAllGamesOfRequirement = (
    requirement: MiniGameRequirements,
    toggled: boolean
  ) => {
    const newCardList = { ...cardList };

    partyCards.forEach((card) => {
      if (requirement === "none") {
        if (!Boolean(card.requirements?.length)) {
          newCardList[card.title] = toggled;
        }
        return;
      }

      if (card.requirements?.includes(requirement)) {
        newCardList[card.title] = toggled;
      }
    });

    setCardList(newCardList);
  };

  return (
    <>
      <Header game={game} gameConfig={gameConfig} />

      <GameNotifications />

      {game.status === "open" && (
        <div className="w-full py-6 px-4 pb-14">
          <h2 className="text-lg font-bold">
            Games List ({getCountOfAllToggledGames()})
          </h2>

          <div className="flex justify-between items-center py-2">
            {requirementToggles.map((line, index) => {
              return (
                <div
                  onClick={() => {
                    setRequirementToggles(
                      requirementToggles.map((item) => {
                        if (item.requirement === line.requirement) {
                          return {
                            ...item,
                            toggled: !item.toggled,
                          };
                        }

                        return item;
                      })
                    );
                    toggleAllGamesOfRequirement(
                      line.requirement,
                      !line.toggled
                    );
                  }}
                  key={index}
                  className={`rounded-full border-2 border-gray-400 h-10 w-10 text-lg flex items-center justify-center ${
                    line.toggled ? "bg-sky-500 border-sky-100 text-white" : ""
                  }}`}
                >
                  {getRequirementIconComponent(line)}
                </div>
              );
            })}
          </div>

          {getGamesList()}
        </div>
      )}
      {game.status === "in-progress" && (
        <div className="flex items-center justify-center grow relative flex-col w-full bg-slate-100 py-6 px-4 overflow-x-hidden">
          <div className="flex mb-6 justify-center flex-col w-full">
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
      )}

      <div className="pb-4 bg-slate-100 w-full grow-0 relative z-20">
        <div className="flex justify-center fixed left-0 bottom-0 w-full py-3 bg-white border-t-2">
          {showStartGameCTA() && (
            <button
              className="px-6 py-2 mx-1 bg-blue-300 rounded-md shadow-md"
              onClick={startGame}
            >
              Start Game
            </button>
          )}

          {showBurnCardCTA() && (
            <button
              className="px-6 py-2 mx-1 bg-blue-300 rounded-md shadow-md"
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
