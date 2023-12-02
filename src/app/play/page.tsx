"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  CardAnimation,
  Game,
  GameStatus,
  Player,
  PlayerAction,
} from "../types";
import NotificationsComponent from "../components/Notifications";
import HandContainer from "../components/HandContainer";
import Players from "../components/Players";
import { GameClass } from "../classes/Game";
import { GRANDMA_GAME_TYPE, getGameConfig } from "../data/game-configs";
import "../components/animations.css";
import { v4 as UUID } from "uuid";

const client = generateClient();
Amplify.configure(amplifyconfig);
function useOutsideAlerter(ref: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert("You clicked outside of me!");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const gameConfig = getGameConfig(GRANDMA_GAME_TYPE);

export default function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [gameData, setGameData] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [dealingCards, setDealingCards] = useState(false);
  const [drawingCard, setDrawingCard] = useState(false);
  const [showWinnerAlert, setShowWinnerAlert] = useState(false);
  const [scoreToAdd, setScoreToAdd] = useState(0);
  const [playerActions, setPlayerActions] = useState<PlayerAction[]>([
    {
      type: "draw",
      completed: false,
      description: "Draw a card from the deck or discard pile",
    },
    {
      type: "discard",
      completed: false,
      description: "Discard a card",
    },
  ]);

  const getCurrentAction = () => {
    if (playerActions) {
      return playerActions.find((action) => !action.completed);
    }
  };

  const onAddPlayer = (e: any) => {
    e.preventDefault();

    if (game) {
      const newPlayer: Player = {
        score: 0,
        name: playerName,
        cards: [],
        id: UUID(),
        type: "player",
      };

      const newGame = new GameClass(game);
      newGame.players.push(newPlayer);

      newGame.lastMove = {
        playerId: newPlayer.id,
        action: "player-join",
        card: null,
      };
      setGame(newGame);
      setPlayerId(newPlayer.id);
      onUpdateGameGQL(newGame);
      localStorage.setItem("playerId", newPlayer.id);
      router.push(`/play?code=${game?.code}&playerId=${newPlayer.id}`);
    }
  };

  const resetPlayerActions = () => {
    const newPlayerActions = [...playerActions];
    newPlayerActions.forEach((action) => {
      action.completed = false;
    });
    localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));
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
      });
      newGame.lastMove = {
        playerId: getMyPlayer()?.id || "",
        action: "new-game",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const getMyPlayer = () => {
    if (game && playerId) {
      return getPlayerById(playerId);
    }
  };

  const onStartGame = () => {
    if (
      game &&
      game.status === "open" &&
      getMyPlayer() &&
      getMyPlayer()?.type === "host"
    ) {
      if (game.players.length < 2) {
        alert("You need at least 2 players to start a game");
        return;
      }

      let newGame = new GameClass(game);
      newGame.status = "in-progress";
      newGame.initializeRound();

      newGame.lastMove = {
        playerId: getMyPlayer()?.id || "",
        action: "new-game",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const getPlayerById = (playerId: string) => {
    if (game) {
      return game.players.find((player) => player.id === playerId);
    }
  };

  const getPlayerIndexById = (playerId: string) => {
    if (!game) {
      return;
    }

    return game.players.findIndex((player) => player.id === playerId);
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
    const nextPlayer = getNextPlayer();

    // todo: always return a player
    if (!nextPlayer) {
      return;
    }
    newGame.playerTurn = nextPlayer.id;

    if (getCurrentRoundWinner()) {
      if (nextPlayer.id === getCurrentRoundWinner()?.id) {
        setDealingCards(true);
        setTimeout(() => {
          setDealingCards(false);
        }, 2000);
        newGame.rounds[newGame.currentRound].status = "complete";
      }
    }

    resetPlayerActions();

    newGame.lastMove = {
      playerId: getMyPlayer()?.id || "",
      action: "end-turn",
      card: null,
    };
    setGame(newGame);
    onUpdateGameGQL(newGame);
  };

  const onClaimRound = () => {
    if (!game) {
      return;
    }

    const newGame = new GameClass(game);
    newGame.rounds[newGame.currentRound].roundWinner = newGame.playerTurn;
    newGame.playerTurn = getNextPlayer()?.id || game.playerTurn;
    resetPlayerActions();
    const player = getMyPlayer();

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "claim-round",
      card: null,
    };
    setGame(newGame);
    onUpdateGameGQL(newGame);
  };

  const onStartNewRound = () => {
    if (game) {
      let newGame = new GameClass(game);
      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length;
      newGame.initializeRound();
      const player = getMyPlayer();

      newGame.lastMove = {
        playerId: player?.id || "",
        action: "new-deal",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onCompleteAction = () => {
    const currentAction = getCurrentAction();

    if (currentAction) {
      const newPlayerActions = [...playerActions];
      newPlayerActions.forEach((action) => {
        if (action.type === currentAction?.type) {
          action.completed = true;
        }
      });
      setPlayerActions(newPlayerActions);
      localStorage.setItem("playerActions", JSON.stringify(newPlayerActions));
    }
  };

  const onDrawCard = () => {
    if (isMyTurn()) {
      drawCardFromDeck();
      onCompleteAction();
    }
  };

  const onDiscardPileClick = () => {
    if (isMyTurn()) {
      if (getCurrentAction()?.type === "discard" && selectedCard) {
        const newCard = { ...selectedCard };
        newCard.status = "discarded";
        onDiscardCard(newCard);
      }

      if (getCurrentAction()?.type === "draw") {
        drawCardFromDiscardDeck();
        onCompleteAction();
      }
    }
  };

  const getCurrnetRound = () => {
    if (game) {
      return game.rounds[game.currentRound];
    }
  };

  const changeCardOrder = (card: Card, orderAdjustment: number) => {
    const player = getPlayerById(playerId);

    if (game && player) {
      card.status = "none";
      const playerIndex = game.players.findIndex(
        (player) => player.id === playerId
      );
      const newGame = new GameClass(game);
      const newPlayerCards = [...player.cards];
      const cardIndex = newPlayerCards.findIndex((c) => c.id === card.id);
      const cardToSwap = newPlayerCards[cardIndex + orderAdjustment];
      if (!cardToSwap) {
        return;
      }
      cardToSwap.status = "none";
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

        player.cards.forEach((card) => {
          card.status = "new-deal";
        });

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
        playerId: getMyPlayer()?.id || "",
        action: "new-deal",
        card: card,
      };
      setGame(newGame);
      setDealingCards(true);

      setTimeout(() => {
        setDealingCards(false);
      }, 2000);

      onUpdateGameGQL(newGame);
    }
  };

  const onDiscardCard = (card: Card) => {
    if (!game || !isMyTurn()) {
      return;
    }

    const player = getPlayerById(playerId);
    const playerIndex = getPlayerIndexById(playerId);

    if (player && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const newDiscardDeck = [...newGame.discardDeck, card];
      newGame.discardDeck = newDiscardDeck;
      const newPlayerCards = player.cards.filter((c) => c.id !== card.id);
      newGame.players[playerIndex].cards = newPlayerCards;

      setSelectedCard(null);
      onCompleteAction();

      newGame.lastMove = {
        playerId: player.id,
        action: "discard",
        card: card,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const drawCardFromDeck = () => {
    if (!game) {
      return;
    }

    const player = getPlayerById(playerId);
    const playerIndex = getPlayerIndexById(playerId);

    if (player && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const card = newGame.deck[0];
      card.status = "drawn";
      const newDeck = newGame.deck.slice(1);
      newGame.deck = newDeck;

      const newPlayerCards = [...player.cards, card];
      newGame.players[playerIndex].cards = newPlayerCards;

      setDrawingCard(true);
      setTimeout(() => {
        setDrawingCard(false);
      }, 2000);

      newGame.lastMove = {
        playerId: player.id,
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

    const player = getPlayerById(playerId);
    const playerIndex = getPlayerIndexById(playerId);

    if (player && playerIndex !== undefined) {
      const newGame = new GameClass(game);
      const card = game.discardDeck[game.discardDeck.length - 1];
      card.status = "drawn";
      const newDiscardDeck = game.discardDeck.slice(
        0,
        game.discardDeck.length - 1
      );
      newGame.discardDeck = newDiscardDeck;

      const newPlayerCards = [...player.cards, card];
      newGame.players[playerIndex].cards = newPlayerCards;
      newGame.lastMove = {
        playerId: player.id,
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

      // remove null player cards
      parsedGame.players.forEach((player) => {
        player.cards = player.cards.filter((card: Card) => card !== null);

        // set card status to none
        player.cards.forEach((card: Card) => {
          card.status = "none";
        });
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

  const sortPlayerCards = (player: Player) => {
    let sortedCards = [...player.cards];

    const prevPlayerData = game?.players.find(
      (prevPlayer) => prevPlayer.id === player.id
    );
    const sortingArr = prevPlayerData?.cards.map((card) => card.id);

    if (sortingArr) {
      sortedCards = sortedCards.sort(function (a, b) {
        return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
      });
    }

    return sortedCards;
  };

  useEffect(() => {
    if (gameData) {
      const parsedGame = reduceGameData(gameData, playerId);

      if (parsedGame) {
        const player = parsedGame.players.find(
          (player) => player.id === playerId
        );

        if (player) {
          setPlayerId(player.id);
          const sortedCards = sortPlayerCards(player);
          player.cards = sortedCards;
        }
      }

      setGame(parsedGame);
    }
  }, [gameData, playerId]);

  const getCurrentRoundWinner = (): Player | undefined => {
    if (game) {
      const round = game.rounds[game.currentRound];

      if (round.roundWinner) {
        const roundWinnderIndex = game.players.findIndex(
          (player) => player.id === round.roundWinner
        );
        return game.players[roundWinnderIndex];
      }
    }

    return;
  };

  const getGameByCode = async (code: string, playerId?: string | null) => {
    try {
      const gameData = await client.graphql({
        query: getGame,
        variables: {
          id: code,
        } as GetGameQueryVariables,
      });

      if (gameData.data) {
        setDealingCards(true);
        setTimeout(() => {
          setDealingCards(false);
        }, 2000);
        setGameData(gameData.data.getGame);
      } else {
        console.error("no game data available");
      }
    } catch (err) {
      console.error("error Getting game", err);
    }
  };

  const isWildCard = (card: Card) => {
    const roundWildCard = (getCurrnetRound()?.drawCount || 0) - 1;

    if (card.value === roundWildCard) {
      return true;
    }

    return card.value === 13;
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

  const getCardAnimation = (card: Card): CardAnimation => {
    const player = getMyPlayer();
    const lastCardInHand = player?.cards?.[player.cards.length - 1];

    if (
      (game?.lastMove?.action === "draw-from-deck" ||
        game?.lastMove?.action === "draw-from-discard") &&
      game.lastMove.playerId === playerId &&
      card.id === lastCardInHand?.id
    ) {
      return "draw-to";
    }

    if (dealingCards) {
      return "new-deal";
    }

    return "none";
  };

  const sortHand = () => {
    const player = getMyPlayer();

    if (!game || !player) {
      return;
    }

    // sort player cards by value
    const sortedCards = [...player.cards].sort((a, b) => {
      return a.value - b.value;
    });

    const newGame = new GameClass(game);
    const playerIndex = newGame.players.findIndex(
      (player) => player.id === playerId
    );
    newGame.players[playerIndex].cards = sortedCards;
    setGame(newGame);
  };

  const getDrawCardAnimation = (deckType: string) => {
    if (!game) {
      return;
    }

    if (deckType === "discard" && game.lastMove?.action === "discard") {
      if (game.lastMove.playerId === playerId) {
        return "discard";
      } else {
        return "discard-reverse";
      }
    }

    if (
      deckType === "discard-bg" &&
      game.lastMove?.action === "draw-from-discard"
    ) {
      if (game.lastMove.playerId === playerId) {
        return "draw-from";
      } else {
        return "draw-from-reverse";
      }
    }

    if (deckType === "deck" && game.lastMove?.action === "draw-from-deck") {
      if (game.lastMove.playerId === playerId) {
        return "draw-from";
      } else {
        return "draw-from-reverse";
      }
    }
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
        playerId: getMyPlayer()?.id || "",
        action: "report-score",
        card: null,
      };
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const getGameWinner = () => {
    if (game) {
      const players = [...game.players];
      players.sort((a, b) => {
        return b.score - a.score;
      });

      return players[0];
    }
  };

  useEffect(() => {
    if (game) {
      if (game.lastMove) {
        if (game.lastMove.playerId !== playerId) {
          resetPlayerActions();
        }

        if (game.lastMove.action === "new-deal") {
          setDealingCards(true);
          setTimeout(() => {
            setDealingCards(false);
          }, 2000);
        }

        if (game.lastMove.action === "claim-round") {
          setShowWinnerAlert(true);
          setTimeout(() => {
            setShowWinnerAlert(false);
          }, 3000);
        }
      }
    }
  }, [game]);

  useEffect(() => {
    const storedPlayerActions = localStorage.getItem("playerActions");
    if (storedPlayerActions) {
      const newPlayerActions = [...playerActions];
      const parsedPlayerActions = JSON.parse(storedPlayerActions);
      newPlayerActions.forEach((action) => {
        const storedAction = parsedPlayerActions.find(
          (a: PlayerAction) => a.type === action.type
        );
        if (storedAction) {
          action.completed = storedAction.completed;
        }
      });
      setPlayerActions(newPlayerActions);
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
          <h1 className="text-2xl">Grandma</h1>
          <p className="text-xs">
            (round{" "}
            {getCurrnetRound() && getCurrnetRound()!.id >= 0
              ? getCurrnetRound()!.id + 1
              : "-"}{" "}
            of {game?.rounds.length})
          </p>
        </div>

        <div className="w-1/4 flex justify-end">
          {/* <div
            className={`rounded-full border-2 flex items-center justify-center h-10 w-10 border-green-600 bg-green-200`}
          ></div> */}
        </div>
      </header>

      {game && (
        <>
          {game.status === "open" && !playerId && (
            <>
              <form onSubmit={onAddPlayer}>
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
                    className="px-6 py-2 mb-5 bg-blue-300 rounded-md"
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
            player={getMyPlayer()}
            isPlayerTurn={isMyTurn()}
            currentPlayerAction={getCurrentAction()}
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
                  {getCurrnetRound()?.status === "complete" && (
                    <div>
                      <h2 className="text-center text-base text-violet-600">
                        {!isLastRound() ? (
                          <>
                            <strong>{getCurrentRoundWinner()?.name}</strong> won
                            the round!
                          </>
                        ) : (
                          <>
                            <strong>{getGameWinner()?.name}</strong> clapped
                            Grannie's cheeks!
                          </>
                        )}
                      </h2>

                      <HandContainer>
                        {getCurrentRoundWinner()?.cards.map((card, index) => {
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
                                    wild={isWildCard(card)}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </HandContainer>
                    </div>
                  )}

                  {getCurrnetRound()?.status === "in-progress" && (
                    <div className="flex mb-6 justify-center">
                      <div className="mx-1">
                        {game.deck.length > 0 ? (
                          (() => {
                            const card = game.deck[0];
                            return (
                              <div className="relative">
                                {/* <span>{game.deck.length}</span> */}
                                {isMyTurn() &&
                                  getCurrentAction()?.type === "draw" && (
                                    <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                                      <div className="animate-ping bg-blue-500 w-3/5 h-3/5 rounded-md"></div>
                                    </div>
                                  )}

                                <div className="absolute left-0 top-0">
                                  <CardComponent card={card} hidden disabled />
                                </div>

                                <div className="relative z-10">
                                  <CardComponent
                                    key={card.id}
                                    card={card}
                                    onClick={() => onDrawCard()}
                                    hidden
                                    disabled={
                                      !isMyTurn() ||
                                      getCurrentAction()?.type !== "draw"
                                    }
                                    animation={getDrawCardAnimation("deck")}
                                  ></CardComponent>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <CardComponent disabled />
                        )}
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
                                  (getCurrentAction()?.type === "draw" ||
                                    (getCurrentAction()?.type === "discard" &&
                                      selectedCard)) && (
                                    <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                                      <div className="animate-ping bg-blue-500 w-3/5 h-3/5 rounded-md"></div>
                                    </div>
                                  )}

                                {game?.lastMove?.card?.id &&
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
                                        animation={getDrawCardAnimation(
                                          "discard-bg"
                                        )}
                                      />
                                    </div>
                                  )}

                                <div className="relative z-10">
                                  {/* <span>{game.discardDeck.length}</span> */}
                                  <CardComponent
                                    wild={isWildCard(card)}
                                    key={card.id}
                                    card={card}
                                    onClick={onDiscardPileClick}
                                    disabled={!isMyTurn()}
                                    animation={getDrawCardAnimation("discard")}
                                  />
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="relative">
                            {isMyTurn() &&
                              getCurrentAction()?.type === "discard" &&
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
                            onClick={() =>
                              setScoreToAdd((prevValue) => prevValue - 1)
                            }
                          >
                            <FaMinus />
                          </button>
                          <div className="font-bold text-lg w-8 text-center">
                            {scoreToAdd}
                          </div>
                          <button
                            className="px-2 py-1 mx-1 w-12 h-12 bg-violet-300 rounded-full shadow-md flex items-center justify-center"
                            onClick={() =>
                              setScoreToAdd((prevValue) => prevValue + 1)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="text-center">
                          <button
                            className="px-6 py-2 mx-1 bg-blue-300 rounded-md"
                            onClick={onReportScore}
                          >
                            Add Points
                          </button>
                        </div>
                      </div>

                      {!isLastRound() && getMyPlayer()?.type === "host" && (
                        <div className="flex justify-center">
                          <button
                            className="px-6 py-2 mx-1 bg-blue-300 rounded-md float-right"
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
                  className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md float-right"
                  onClick={onNewGame}
                >
                  New Game
                </button>
              )}

              {game.status === "open" &&
                getMyPlayer()?.type === "host" &&
                game.players.length >= 2 && (
                  <button
                    className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md float-right"
                    onClick={onStartGame}
                  >
                    Start Game
                  </button>
                )}

              {getCurrnetRound()?.status === "open" &&
                playerId &&
                getCurrnetRound()?.dealer === playerId && (
                  <button
                    className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md float-right"
                    onClick={onDealCardsToPlayers}
                  >
                    Deal
                  </button>
                )}

              {game.status === "in-progress" && isMyTurn() && (
                <div className="flex justify-center">
                  {!getCurrentAction() && (
                    <>
                      {!getCurrentRoundWinner() && (
                        <button
                          className="px-6 py-2 mb-2 mx-1 bg-red-300 rounded-md float-right"
                          onClick={onClaimRound}
                        >
                          GRANDMA!!!
                        </button>
                      )}
                      <button
                        className="px-6 py-2 mb-2 mx-1 bg-blue-300 rounded-md float-right"
                        onClick={onEndTurn}
                      >
                        End Turn
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative overflow-y-visible overflow-x-hidden">
              {selectedCard && (
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
              <HandContainer>
                {getMyPlayer()?.cards.map((card, index) => {
                  return (
                    <div
                      key={card.id}
                      style={{
                        zIndex: index,
                      }}
                      className="relative w-12 h-14"
                    >
                      <div className="absolute left-0 top-0">
                        <CardComponent
                          selected={selectedCard?.id === card?.id}
                          wild={isWildCard(card)}
                          card={card}
                          onClick={() => onCardInHandClick(card)}
                          size="small"
                          index={index}
                          animation={getCardAnimation(card)}
                        />
                      </div>
                    </div>
                  );
                })}
              </HandContainer>
            </div>
          </div>

          {Boolean(getMyPlayer()?.cards?.length) && !selectedCard && (
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
