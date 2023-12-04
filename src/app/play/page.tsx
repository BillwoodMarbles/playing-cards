"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { onUpdateGame } from "@/graphql/subscriptions";
import { getGame } from "@/graphql/queries";
import { GetGameQueryVariables } from "@/API";
import { Amplify } from "aws-amplify";
import amplifyconfig from "../../amplifyconfiguration.json";
import { updateGame } from "@/graphql/mutations";
import CardComponent from "../components/Card";
import {
  FaAngleLeft,
  FaAngleRight,
  FaMinus,
  FaPlus,
  FaShareFromSquare,
  FaShuffle,
} from "react-icons/fa6";
import {
  Card,
  Game,
  GameConfig,
  GameStatus,
  Player,
  PlayerAction,
  PlayerActions,
} from "../types";
import NotificationsComponent from "../components/Notifications";
import HandContainer from "../components/HandContainer";
import Players from "../components/Players";
import { GameClass } from "../classes/Game";
import { GameTypes, PLAYER_ACTIONS, getGameConfig } from "../data/game-configs";
import "../styles/animations.css";
import useAnimations from "../hooks/useAnimations";
import {
  getCurrentAction,
  getPlayerById,
  getPlayerIndexById,
  sortPlayerCards,
} from "../utils/player";
import useGame from "../hooks/useGame";
import Deck from "../components/Deck";
import Hand from "../components/Hand";
import {
  getCurrentRoundWinner,
  getGameWinner,
  isWildCard,
} from "../utils/game";
import PlayerCTAs from "../components/PlayerCTAs";
import { shuffleCards } from "../utils/cards";

const client = generateClient();
Amplify.configure(amplifyconfig);

export default function Play() {
  const [playerId, setPlayerId] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>(getGameConfig());
  const myPlayer = getPlayerById(game, playerId);

  const router = useRouter();
  const gameHook = useGame(myPlayer);
  const { getDeckAnimation } = useAnimations(game, myPlayer);

  const searchParams = useSearchParams();
  const [playerName, setPlayerName] = useState("");
  const [gameData, setGameData] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showWinnerAlert, setShowWinnerAlert] = useState(false);
  const [scoreToAdd, setScoreToAdd] = useState(0);
  const [peekedCards, setPeekedCards] = useState<Card[]>([]);
  const [playerActions, setPlayerActions] = useState<PlayerAction[]>([
    PLAYER_ACTIONS[PlayerActions.DRAW],
    PLAYER_ACTIONS[PlayerActions.DISCARD],
  ]);

  const getCurrnetRound = () => {
    if (game) {
      return game.rounds[game.currentRound];
    }
  };

  const addPlayer = () => {
    const { gameData, player } = gameHook.addPlayer(playerName);
    setPlayerId(player.id);
    setGame(gameData); // todo: remove this
    onUpdateGameGQL(gameData);
    router.push(`/play?code=${game?.code}&playerId=${player.id}`);
  };

  const resetPlayerActions = () => {
    const currentRound = getCurrnetRound();
    if (currentRound) {
      const newPlayerActions = [...currentRound.playerActions];
      localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));
      setPlayerActions(newPlayerActions);
    }
  };

  const onUpdateGameGQL = async (game: Game) => {
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

  const isMyTurn = () => {
    if (game && playerId !== null) {
      return game.playerTurn === playerId;
    }
  };

  const onNewGame = () => {
    // reset game
    if (game) {
      const newGame = new GameClass({
        rounds: gameConfig.rounds,
        code: game.code,
        id: game.id,
        players: game.players,
        gameType: game.gameType,
      });
      newGame.players?.forEach((player) => {
        player.cards = [];
        player.score = 0;
      });
      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "new-game",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onStartGame = () => {
    if (game && game.status === "open" && myPlayer?.type === "host") {
      if (game.players.length < 2) {
        alert("You need at least 2 players to start a game");
        return;
      }

      let newGame = new GameClass(game);
      newGame.status = "in-progress";
      newGame.initializeRound();

      const currentRound = newGame.rounds[0];
      const newPlayerActions = [...currentRound.playerActions];
      console.log("newPlayerActions", newPlayerActions);
      setPlayerActions(newPlayerActions);
      localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));

      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "new-game",
        card: null,
      };

      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const updateScoreToAdd = (type: "plus" | "minus") => {
    if (type === "plus") {
      setScoreToAdd((prevValue) => prevValue + (gameConfig.pointCount || 1));
    } else {
      setScoreToAdd((prevValue) => prevValue - (gameConfig.pointCount || 1));
    }
  };

  const getNextPlayer = (): Player | void => {
    if (!game) {
      return;
    }

    const currentPlayerIndex = game.players.findIndex(
      (player) => player.id === game.playerTurn
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
    const nextPlayer = game.players[nextPlayerIndex];
    return nextPlayer;
  };

  const onEndTurn = () => {
    if (!game) {
      return;
    }

    const newGame = new GameClass(game);
    const currentPlayerTurn = newGame.playerTurn;
    const nextPlayer = getNextPlayer();
    const currentRound = getCurrnetRound();
    const roundWinner = getCurrentRoundWinner(game);

    if (!nextPlayer || !currentRound) {
      return;
    }

    // if next player is the dealer, increment turn count
    if (currentPlayerTurn === currentRound.dealer) {
      newGame.rounds[newGame.currentRound].turnCount += 1;
    }

    // if next player is the dealer and turn count is max turns, end round
    if (currentRound.maxTurns) {
      if (currentPlayerTurn === currentRound.dealer) {
        if (currentRound.turnCount >= currentRound.maxTurns) {
          newGame.rounds[newGame.currentRound].status = "complete";
        } else if (currentRound.turnCount === currentRound.maxTurns - 1) {
          newGame.rounds[newGame.currentRound].status = "last-turn";
        }
      }
    } else {
      const isLastTurn = getCurrnetRound()?.status === "last-turn";

      if (isLastTurn) {
        if (nextPlayer.id === roundWinner?.id) {
          newGame.rounds[newGame.currentRound].status = "complete";
        }
      }
    }

    // set next player turn
    newGame.playerTurn = nextPlayer.id;

    // reset player actions
    resetPlayerActions();

    newGame.lastMove = {
      playerId: myPlayer?.id || "",
      action: "end-turn",
      card: null,
    };
    setGame(newGame);
    onUpdateGameGQL(newGame);
  };

  const claimRound = () => {
    const gameData = gameHook.claimRound();
    setGame(gameData); // todo: remove this
    onUpdateGameGQL(gameData);
  };

  const onStartNewRound = () => {
    if (game) {
      let newGame = new GameClass(game);
      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length;
      newGame.initializeRound();

      const currentRound = newGame.rounds[newGame.currentRound];
      const newPlayerActions = [...currentRound.playerActions];
      console.log(
        "setting player actions from start new round",
        newPlayerActions
      );
      setPlayerActions(newPlayerActions);
      localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));

      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "new-deal",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onCompleteAction = () => {
    const currentAction = getCurrentAction(playerActions, game);

    if (currentAction) {
      const newPlayerActions = [...playerActions];
      newPlayerActions.forEach((action) => {
        if (action.type === currentAction?.type) {
          action.completed = true;
          return;
        }
      });
      console.log(
        "setting player actions from complete action",
        newPlayerActions
      );

      setPlayerActions(newPlayerActions);
      localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));
    }
  };

  const drawCard = () => {
    drawCardFromDeck();
    onCompleteAction();
  };

  const onDiscardPileClick = () => {
    if (isMyTurn()) {
      if (
        getCurrentAction(playerActions, game)?.type === "discard" &&
        selectedCard
      ) {
        const newCard = { ...selectedCard };
        onDiscardCard(newCard);
      }

      if (getCurrentAction(playerActions, game)?.type === "draw") {
        drawCardFromDiscardDeck();
        onCompleteAction();
      }
    }
  };

  const changeCardOrder = (card: Card, orderAdjustment: number) => {
    if (game && myPlayer) {
      const playerIndex = game.players.findIndex(
        (player) => player.id === playerId
      );
      const newGame = new GameClass(game);
      const newPlayerCards = [...myPlayer.cards];
      const cardIndex = newPlayerCards.findIndex((c) => c.id === card.id);
      const cardToSwap = newPlayerCards[cardIndex + orderAdjustment];
      if (!cardToSwap) {
        return;
      }
      newPlayerCards[cardIndex + orderAdjustment] = card;
      newPlayerCards[cardIndex] = cardToSwap;
      newGame.players[playerIndex].cards = newPlayerCards;
      setGame(newGame);
    }
  };

  const onDealCardsToPlayers = () => {
    if (game) {
      const newGame = new GameClass(game);
      newGame.initializeDeck();

      newGame.players?.forEach((player) => {
        player.cards = newGame.deck.slice(0, getCurrnetRound()?.drawCount);

        if (gameConfig.type === GameTypes.MINI_GOLF) {
          player.cards.forEach((card) => {
            card.status = "hidden";
          });
        } else {
          player.cards.forEach((card) => {
            card.status = "none";
          });
        }
        newGame.deck = newGame.deck.slice(getCurrnetRound()?.drawCount);
      });

      // deal card to discard deck
      const card = newGame.deck[0];
      const newDeck = newGame.deck.slice(1);
      newGame.deck = newDeck;
      const newDiscardDeck = [card];
      newGame.discardDeck = newDiscardDeck;

      // set round status to in-progress
      const newRounds = [...newGame.rounds];
      newRounds[newGame.currentRound].status = "in-progress";
      newGame.rounds = newRounds;

      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "new-deal",
        card: card,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onStartTurn = () => {
    setPeekedCards([]);
    onCompleteAction();
  };

  const onDiscardCard = (card: Card) => {
    if (!game || !isMyTurn()) {
      return;
    }

    if (GameTypes.MINI_GOLF === game.gameType && card.status !== "hidden") {
      return;
    }

    const playerIndex = getPlayerIndexById(game, playerId);

    if (myPlayer && playerIndex !== null && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const newDiscardDeck = [...newGame.discardDeck, card];
      newGame.discardDeck = newDiscardDeck;
      const newPlayerCards = myPlayer.cards.filter((c) => c.id !== card.id);
      newGame.players[playerIndex].cards = newPlayerCards;

      setSelectedCard(null);
      onCompleteAction();

      newGame.lastMove = {
        playerId: myPlayer.id,
        action: "discard",
        card: card,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const showEndOfTurnCTAs = () => {
    return (
      game &&
      game.status === "in-progress" &&
      isMyTurn() &&
      !getCurrentAction(playerActions, game)
    );
  };

  const drawCardFromDeck = () => {
    if (!game) {
      return;
    }

    const playerIndex = getPlayerIndexById(game, playerId);

    if (myPlayer && playerIndex !== null && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const card = newGame.deck[0];
      const newDeck = newGame.deck.slice(1);
      newGame.deck = newDeck;

      const newPlayerCards = [...myPlayer.cards, card];
      newGame.players[playerIndex].cards = newPlayerCards;

      // if deck is empty, add discard pule back to deck and reshuflle
      if (newGame.deck.length === 0) {
        newGame.deck = [...newGame.discardDeck.slice(0, -1)];
        newGame.deck = shuffleCards(newGame.deck);
        newGame.discardDeck = [
          newGame.discardDeck[newGame.discardDeck.length - 1],
        ];
      }

      newGame.lastMove = {
        playerId: myPlayer.id,
        action: "draw-from-deck",
        card: card,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const drawCardFromDiscardDeck = () => {
    if (!game) {
      return;
    }

    const playerIndex = getPlayerIndexById(game, playerId);

    if (myPlayer && playerIndex !== null && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const card = game.discardDeck[game.discardDeck.length - 1];
      const newDiscardDeck = game.discardDeck.slice(
        0,
        game.discardDeck.length - 1
      );
      newGame.discardDeck = newDiscardDeck;

      card.status = "visible";
      const newPlayerCards = [...myPlayer.cards, card];
      newGame.players[playerIndex].cards = newPlayerCards;
      newGame.lastMove = {
        playerId: myPlayer.id,
        action: "draw-from-discard",
        card: card,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const reduceGameData = (gameData: any, playerId?: string | null) => {
    if (gameData) {
      const parsedGame: Game = {
        id: gameData.id,
        code: gameData.code,
        status: gameData.status as GameStatus,
        playerTurn: gameData.playerTurn || 0,
        deck: gameData.deck ? JSON.parse(gameData.deck) : [],
        discardDeck: gameData.discardDeck
          ? JSON.parse(gameData.discardDeck)
          : [],
        players: gameData.players ? JSON.parse(gameData.players) : [],
        rounds: gameData.rounds ? JSON.parse(gameData.rounds) : [],
        currentRound: gameData.currentRound || 0,
        gameType: gameData.gameType || "standard",
        lastMove: gameData.lastMove
          ? JSON.parse(gameData.lastMove)
          : {
              playerId: "",
              action: "",
              card: null,
            },
      };

      if (
        parsedGame.lastMove?.action === "new-game" ||
        parsedGame.lastMove?.action === "start-round" ||
        parsedGame.lastMove?.action === "new-deal" ||
        parsedGame.lastMove?.action === "end-turn"
      ) {
        console.log("RESETTING FROM DATA UPDATE");
        resetPlayerActions();
      }

      // remove null player cards
      parsedGame.players.forEach((player) => {
        player.cards = player.cards.filter((card: Card) => card !== null);
      });

      return parsedGame;
    }

    return null;
  };

  const subscribeToGameUpdates = (code: string, playerId?: string | null) => {
    let subscription: any;
    try {
      subscription = client
        .graphql({
          query: onUpdateGame,
          variables: {
            filter: {
              id: { eq: code },
            },
          },
        })
        .subscribe({
          next: (eventData: any) => {
            if (eventData.data) {
              setGameData(eventData.data.onUpdateGame);
            }
          },
        });
    } catch (err) {
      console.error("error subscribing to game updates", err);
    }

    return subscription;
  };

  useEffect(() => {
    if (gameData) {
      const parsedGame = reduceGameData(gameData, playerId);

      if (parsedGame) {
        parsedGame.players.forEach((player) => {
          if (player.id === playerId) {
            const sortedCards = sortPlayerCards(game, player);
            player.cards = sortedCards;
          }
        });

        gameHook.setGame(parsedGame);
      }

      setGameConfig(getGameConfig(parsedGame?.gameType));
      setGame(parsedGame);
    }
  }, [gameData, playerId]);

  const getGameByCode = async (code: string, playerId?: string | null) => {
    try {
      const gameData = await client.graphql({
        query: getGame,
        variables: {
          id: code,
        } as GetGameQueryVariables,
      });

      if (gameData.data) {
        setGameData(gameData.data.getGame);
      } else {
        console.error("no game data available");
      }
    } catch (err) {
      console.error("error Getting game", err);
    }
  };

  const isLastRound = () => {
    if (game) {
      return game.currentRound === game.rounds.length - 1;
    }
  };

  const copyCurrentRouteToClipboard = () => {
    let path = window.location.href.split("?")[0];
    path += `?code=${game?.code}`;
    navigator.clipboard.writeText(path);
  };

  const onCardInHandClick = (card: Card) => {
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const onRevealCard = (card: Card) => {
    if (game) {
      const newGame = new GameClass(game);
      const playerIndex = getPlayerIndexById(newGame, playerId);

      if (playerIndex === null || playerIndex === undefined) {
        return;
      }

      const cardIndex = newGame.players[playerIndex].cards.findIndex(
        (c) => c.id === card.id
      );

      if (cardIndex >= 0) {
        newGame.players[playerIndex].cards[cardIndex].status = "visible";
        newGame.lastMove = {
          playerId: myPlayer?.id || "",
          action: "reveal-card",
          card: card,
        };
        onCompleteAction();
        setGame(newGame);
        onUpdateGameGQL(newGame);
      }
    }
  };

  const onPeekCard = (card: Card) => {
    if (!game) {
      return;
    }

    if (peekedCards.length >= 2) {
      return;
    }

    if (peekedCards.find((c) => c.id === card.id)) {
      return;
    }

    setPeekedCards((prevValue) => [...prevValue, card]);
  };

  const sortHand = () => {
    if (!game || !myPlayer) {
      return;
    }

    // sort player cards by value
    const sortedCards = [...myPlayer.cards].sort((a, b) => {
      return a.value - b.value;
    });

    const newGame = new GameClass(game);
    const playerIndex = newGame.players.findIndex(
      (player) => player.id === playerId
    );
    newGame.players[playerIndex].cards = sortedCards;
    setGame(newGame);
  };

  const onReportScore = () => {
    if (game) {
      const newGame = new GameClass(game);

      newGame.players.forEach((player) => {
        if (player.id === playerId) {
          player.score += scoreToAdd;
        }
      });

      setScoreToAdd(0);

      newGame.lastMove = {
        playerId: myPlayer?.id || "",
        action: "report-score",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const addDiscardPileToDeck = () => {
    if (!game) {
      return;
    }

    const newGame = new GameClass(game);

    const newDeck = [...newGame.deck, ...newGame.discardDeck.slice(0, -1)];
    newGame.deck = newDeck;
    newGame.discardDeck = [newGame.discardDeck[newGame.discardDeck.length - 1]];

    newGame.lastMove = {
      playerId: myPlayer?.id || "",
      action: "none",
      card: null,
    };

    setGame(newGame);
    onUpdateGameGQL(newGame);
  };

  useEffect(() => {
    if (game?.lastMove) {
      if (game.lastMove.action === "claim-round") {
        setShowWinnerAlert(true);
        setTimeout(() => {
          setShowWinnerAlert(false);
        }, 3000);
      }
    }
  }, [game]);

  useEffect(() => {
    const storedPlayerActions = localStorage.getItem("playerActions");

    if (storedPlayerActions) {
      const parsedPlayerActions = JSON.parse(storedPlayerActions);
      if (parsedPlayerActions) {
        setPlayerActions(parsedPlayerActions);
      }
    }

    const playerId = searchParams.get("playerId");
    const code = searchParams.get("code");

    let subscription: any;

    if (playerId) {
      setPlayerId(playerId);
    }

    if (code) {
      getGameByCode(code, playerId);
      subscription = subscribeToGameUpdates(code);
    }

    if (subscription) {
      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <>
      <header className="px-4 py-3 flex items-center w-full">
        <div className="w-1/4">
          <button
            className="ml-2 flex items-center"
            onClick={copyCurrentRouteToClipboard}
          >
            {game?.code}
            <FaShareFromSquare className="ml-2" />
          </button>
        </div>
        <div className="text-center grow">
          <h1 className="text-2xl">{gameConfig.name}</h1>
          <p className="text-xs">
            (round{" "}
            {getCurrnetRound() && getCurrnetRound()!.id >= 0
              ? getCurrnetRound()!.id + 1
              : "-"}{" "}
            of {game?.rounds.length} - turn{" "}
            {(getCurrnetRound()?.turnCount || 0) + 1} of{" "}
            {getCurrnetRound()?.maxTurns || "∞"})
          </p>
        </div>

        <div className="w-1/4 flex justify-end"></div>
      </header>

      {game && (
        <>
          {game.status === "open" && !playerId && (
            <>
              <form onSubmit={() => addPlayer()}>
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
            </>
          )}

          <NotificationsComponent
            game={game}
            player={myPlayer}
            isPlayerTurn={isMyTurn()}
            currentPlayerAction={getCurrentAction(playerActions, game)}
            currentRound={getCurrnetRound()}
          />

          <div className="relative py-4 px-3 bg-slate-100 w-full">
            {game.players.length > 0 && (
              <Players playerTurn={game.playerTurn} players={game.players} />
            )}
          </div>

          <div className="flex items-center justify-center grow relative flex-col w-full bg-slate-100 py-6">
            <div className="w-full">
              {showWinnerAlert && (
                <div className="absolute top-0 left-0 w-full h-full winner-alert justify-center flex items-center z-30">
                  <strong className="text-5xl text-violet-600 text-sh">
                    GRANDMA!
                  </strong>
                </div>
              )}

              {game.status === "in-progress" && (
                <>
                  {getCurrnetRound()?.status === "complete" &&
                    gameConfig.type === GameTypes.GRANDMA && (
                      <div>
                        <h2 className="text-center text-base text-violet-600">
                          {!isLastRound() ? (
                            <>
                              <strong>
                                {getCurrentRoundWinner(game)?.name}
                              </strong>{" "}
                              won the round!
                            </>
                          ) : (
                            <>
                              <strong>{getGameWinner(game)?.name}</strong>{" "}
                              clapped Grannie&apos;s cheeks!
                            </>
                          )}
                        </h2>

                        <HandContainer>
                          {getCurrentRoundWinner(game)?.cards.map(
                            (card, index) => {
                              return (
                                <>
                                  <div
                                    key={card.id}
                                    style={{
                                      minWidth: "2rem",
                                      maxWidth: "6rem",
                                      zIndex: index,
                                    }}
                                    className="relative w-12 h-14"
                                  >
                                    <div className="absolute left-0 top-0">
                                      <CardComponent
                                        key={card.id}
                                        card={card}
                                        disabled
                                        size="small"
                                        index={index}
                                        animation="new-deal"
                                        wild={isWildCard(game, card)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )}
                        </HandContainer>
                      </div>
                    )}

                  {(getCurrnetRound()?.status === "in-progress" ||
                    getCurrnetRound()?.status === "last-turn") && (
                    <div className="flex mb-6 justify-center">
                      <div className="mx-1">
                        <Deck
                          cards={game.deck}
                          enabled={Boolean(
                            isMyTurn() &&
                              getCurrentAction(playerActions, game)?.type ===
                                "draw"
                          )}
                          onClick={drawCard}
                          animation={getDeckAnimation("deck")}
                        />
                      </div>

                      <div className="mx-1">
                        {game.discardDeck.length > 0 &&
                        game.discardDeck[game.discardDeck.length - 1] ? (
                          (() => {
                            const card =
                              game.discardDeck[game.discardDeck.length - 1];
                            return (
                              <div className="relative">
                                {isMyTurn() &&
                                  (getCurrentAction(playerActions, game)
                                    ?.type === "draw" ||
                                    (getCurrentAction(playerActions, game)
                                      ?.type === "discard" &&
                                      selectedCard)) && (
                                    <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                                      <div className="animate-ping bg-blue-500 w-3/5 h-3/5 rounded-md"></div>
                                    </div>
                                  )}

                                {game.lastMove?.card &&
                                  game.lastMove.card.id >= 0 &&
                                  (game.lastMove.action ===
                                    "draw-from-discard" ||
                                    game.lastMove.action === "discard") && (
                                    <div
                                      className={`absolute left-0 top-0 ${
                                        game.lastMove.action === "discard"
                                          ? "z-0"
                                          : "z-20"
                                      }`}
                                    >
                                      <CardComponent
                                        card={
                                          game.lastMove.action ===
                                          "draw-from-discard"
                                            ? card
                                            : game.discardDeck[
                                                game.discardDeck.length - 2
                                              ]
                                        }
                                        disabled={!isMyTurn()}
                                        onClick={onDiscardPileClick}
                                        animation={getDeckAnimation(
                                          "discard-bg"
                                        )}
                                      />
                                    </div>
                                  )}

                                <div className="relative z-10">
                                  {/* <span>{game.discardDeck.length}</span> */}
                                  <CardComponent
                                    wild={isWildCard(game, card)}
                                    key={card.id}
                                    card={card}
                                    onClick={onDiscardPileClick}
                                    disabled={!isMyTurn()}
                                    animation={getDeckAnimation("discard")}
                                  />
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="relative">
                            {isMyTurn() &&
                              getCurrentAction(playerActions, game)?.type ===
                                "discard" &&
                              selectedCard && (
                                <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                                  <div className="animate-ping bg-blue-500 w-3/5 h-3/5 rounded-md"></div>
                                </div>
                              )}
                            <CardComponent onClick={onDiscardPileClick} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {getCurrnetRound()?.status === "complete" && (
                    <>
                      <div className="w-full py-3 mb-4 mt-4 border border-white bg-slate-50">
                        <div className="flex items-center justify-center mb-4">
                          <button
                            className="px-2 py-1 mx-1 w-12 h-12 bg-red-300 rounded-full shadow-md flex items-center justify-center"
                            onClick={() => updateScoreToAdd("minus")}
                          >
                            <FaMinus />
                          </button>
                          <div className="w-8 text-center">
                            <span className="font-bold text-lg">
                              {scoreToAdd}
                            </span>
                          </div>
                          <button
                            className="px-2 py-1 mx-1 w-12 h-12 bg-violet-300 rounded-full shadow-md flex items-center justify-center"
                            onClick={() => updateScoreToAdd("plus")}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="text-center">
                          <button
                            className="px-6 py-2 mx-1 bg-blue-300 rounded-md shadow-md align-middle"
                            onClick={onReportScore}
                          >
                            Save Score{" "}
                            <span className="">
                              ({(myPlayer?.score || 0) + scoreToAdd})
                            </span>
                          </button>
                        </div>
                      </div>

                      {!isLastRound() && myPlayer?.type === "host" && (
                        <div className="flex justify-center">
                          <button
                            className="px-6 py-2 mx-1 bg-blue-300 rounded-md shadow-md"
                            onClick={onStartNewRound}
                          >
                            Start New Round
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="pb-4 bg-slate-100 w-full grow-0 relative z-20">
            <div className="flex justify-center absolute left-0 bottom-full w-full">
              {getCurrnetRound()?.status === "complete" && isLastRound() && (
                <button
                  className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                  onClick={onNewGame}
                >
                  New Game
                </button>
              )}
              {game.status === "open" &&
                myPlayer?.type === "host" &&
                game.players.length >= 2 && (
                  <button
                    className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                    onClick={onStartGame}
                  >
                    Start Game
                  </button>
                )}
              {getCurrnetRound()?.status === "open" &&
                playerId &&
                getCurrnetRound()?.dealer === playerId && (
                  <button
                    className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                    onClick={onDealCardsToPlayers}
                  >
                    Deal
                  </button>
                )}

              {getCurrentAction(playerActions, game)?.type ===
                PlayerActions.REVEAL_CARD &&
                selectedCard && (
                  <button
                    className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                    onClick={() => onRevealCard(selectedCard)}
                  >
                    Reveal Card
                  </button>
                )}

              {getCurrentAction(playerActions, game)?.type ===
                PlayerActions.PEEK &&
                isMyTurn() && (
                  <>
                    {peekedCards.length < 2 && selectedCard && (
                      <button
                        className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                        onClick={() => onPeekCard(selectedCard)}
                      >
                        Peek at Card
                      </button>
                    )}

                    {peekedCards.length >= 2 && (
                      <button
                        className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md shadow-md"
                        onClick={() => onStartTurn()}
                      >
                        Start Turn
                      </button>
                    )}
                  </>
                )}

              {showEndOfTurnCTAs() && (
                <PlayerCTAs
                  game={game}
                  onClaimRound={claimRound}
                  onEndTurn={onEndTurn}
                />
              )}
            </div>

            <div className="relative">
              {selectedCard && game.gameType !== GameTypes.MINI_GOLF && (
                <>
                  <div className="absolute -left-4 flex items-center z-50 top-1/2 -translate-y-1/2">
                    <button
                      className="px-2 py-1 mx-1 w-12 h-12 bg-blue-300 rounded-full shadow-md flex items-center justify-center"
                      onClick={() => changeCardOrder(selectedCard, -1)}
                    >
                      <FaAngleLeft />
                    </button>
                  </div>

                  <div className="absolute -right-4 flex items-center z-50 top-1/2 -translate-y-1/2">
                    <button
                      className="px-2 py-1 mx-1 w-12 h-12 bg-blue-300 rounded-full shadow-md flex items-center justify-center"
                      onClick={() => changeCardOrder(selectedCard, 1)}
                    >
                      <FaAngleRight />
                    </button>
                  </div>
                </>
              )}
              <Hand
                game={game}
                peekedCards={peekedCards}
                player={myPlayer}
                cards={myPlayer?.cards || []}
                selectedCard={selectedCard}
                onClick={onCardInHandClick}
              />
            </div>
          </div>

          {Boolean(myPlayer?.cards?.length) &&
            !selectedCard &&
            (game.gameType !== GameTypes.MINI_GOLF ||
              getCurrnetRound()?.status === "complete") && (
              <div className="absolute right-0 flex items-center z-50 -bottom-4 -translate-y-1/2">
                <button
                  className="px-2 py-1 mx-1 w-12 h-12 bg-blue-300 rounded-full shadow-md flex items-center justify-center"
                  onClick={() => sortHand()}
                >
                  <FaShuffle />
                </button>
              </div>
            )}
        </>
      )}
    </>
  );
}
