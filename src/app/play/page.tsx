"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { onUpdateGame } from "@/graphql/subscriptions";
import { getGame } from "@/graphql/queries";
import { GetGameQuery, GetGameQueryVariables } from "@/API";
import { Amplify } from "aws-amplify";
import amplifyconfig from "../../amplifyconfiguration.json";
import { updateGame } from "@/graphql/mutations";
import CardComponent from "../components/Card";
import { FaAngleLeft, FaAngleRight, FaShareFromSquare } from "react-icons/fa6";
import { Card, Game, GameStatus, Player, PlayerAction, Round } from "../types";
import NotificationsComponent from "../components/Notifications";
import HandContainer from "../components/HandContainer";
import Players from "../components/Players";
import { GameClass } from "../classes/game";

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
const gameRounds = buildDefaultRounds();

const playerActions: PlayerAction[] = [
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
];

export default function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const [gameCode, setGameCode] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [myPlayer, setMyPlayer] = useState<number | null>(null);
  const [playerCardSortOrder, setPlayerCardsSortOrder] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const currentAction = playerActions.find(
    (action) => action.completed === false
  );

  const onAddPlayer = (e: any) => {
    e.preventDefault();

    if (game) {
      const newPlayer: Player = {
        name: playerName,
        cards: [],
        id: game.players.length,
        type: "player",
      };

      const newGame = new GameClass(game);
      newGame.players.push(newPlayer);
      setGame(newGame);
      setPlayerId(newPlayer.name);
      setMyPlayer(newPlayer.id);
      onUpdateGameGQL(newGame);
      router.push(`/play?code=${game?.code}&player=${newPlayer.name}`);
    }
  };

  const resetPlayerActions = () => {
    playerActions.forEach((action) => {
      action.completed = false;
    });
  };

  const getCurrentPlayerAction = () => {
    return playerActions.find((action) => action.completed === false);
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
          },
        },
      });
    } catch (err) {
      console.error("error updating game", err);
    }
  };

  const isMyTurn = () => {
    if (game && myPlayer !== null) {
      return game.playerTurn === myPlayer;
    }
  };

  const onNewGame = () => {
    // reset game
    if (game) {
      const newGame = new GameClass({
        rounds: gameRounds,
        code: game.code,
        id: game.id,
        players: game.players,
        gameType: game.gameType,
      });
      newGame.players?.forEach((player) => {
        player.cards = [];
      });
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const getMyPlayer = () => {
    if (game && playerId) {
      const player = game.players.find((player) => player.name === playerId);
      if (player) {
        return player;
      }
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

      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onEndTurn = () => {
    if (game) {
      const newGame = new GameClass(game);
      const nextPlayer = (newGame.playerTurn + 1) % newGame.players.length;
      newGame.playerTurn = nextPlayer;

      if (getCurrentRoundWinner()) {
        if (newGame.players[nextPlayer].name === getCurrentRoundWinner()) {
          newGame.rounds[newGame.currentRound].status = "complete";
        }
      }

      resetPlayerActions();
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onClaimRound = () => {
    if (game) {
      const newGame = new GameClass(game);
      newGame.rounds[newGame.currentRound].roundWinner =
        myPlayer !== null && myPlayer >= 0 ? myPlayer : -1;
      newGame.playerTurn = (newGame.playerTurn + 1) % newGame.players.length;
      resetPlayerActions();
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onStartNewRound = () => {
    if (game) {
      let newGame = new GameClass(game);
      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length;
      newGame.initializeRound();
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onCompleteAction = () => {
    if (currentAction) {
      currentAction.completed = true;
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
      if (currentAction?.type === "discard" && selectedCard) {
        onDiscardCard(selectedCard);
      }

      if (currentAction?.type === "draw") {
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

  const checkThatPlayerCardsExistInSortOrder = () => {
    const newPlayerCardSortOrder = [...playerCardSortOrder];

    if (game && myPlayer !== null) {
      const playerCards = game.players[myPlayer].cards;

      playerCards.forEach((card) => {
        const cardId = newPlayerCardSortOrder.find((id) => id === card.id);

        if (cardId === undefined) {
          newPlayerCardSortOrder.push(card.id);
        }
      });

      setPlayerCardsSortOrder(newPlayerCardSortOrder);
    }

    return newPlayerCardSortOrder;
  };

  const changeCardOrder = (card: Card, orderAdjustment: number) => {
    if (game && myPlayer !== null) {
      const newSortOrder = checkThatPlayerCardsExistInSortOrder();
      const cardIndex = newSortOrder.findIndex((id) => id === card.id);

      if (
        cardIndex + orderAdjustment >= 0 &&
        cardIndex + orderAdjustment < game.players[myPlayer].cards.length
      ) {
        newSortOrder.splice(cardIndex, 1);
        newSortOrder.splice(cardIndex + orderAdjustment, 0, card.id || 0);
      }

      setPlayerCardsSortOrder(newSortOrder);
    }
  };

  const getPlayerCards = () => {
    if (game && myPlayer !== null) {
      // sort player cards by order
      const playerCards = game.players[myPlayer].cards;
      const newPlayerCards: Card[] = [];

      playerCardSortOrder.forEach((id) => {
        const card = playerCards.find((card) => card.id === id);
        if (card) {
          newPlayerCards.push(card);
        }
      });

      // for all playerCards not in newPlayerCards add to end of newPlayerCards
      playerCards.forEach((card) => {
        if (!newPlayerCards.find((c) => c.id === card.id)) {
          newPlayerCards.push(card);
        }
      });

      return newPlayerCards;
    }
  };

  const onDealCardsToPlayers = () => {
    if (game) {
      const newGame = new GameClass(game);
      newGame.initializeDeck();

      newGame.players?.forEach((player) => {
        player.cards = newGame.deck.slice(0, getCurrnetRound()?.drawCount);

        // get card ids from player cards
        const playerCardIds = player.cards.map((card) => card.id);

        if (myPlayer !== null && player.id === myPlayer) {
          const newPlayerCardSortOrder = playerCardIds;
          newPlayerCardSortOrder.sort((a, b) => a - b);
          setPlayerCardsSortOrder(newPlayerCardSortOrder);
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

      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onDiscardCard = (card: Card) => {
    if (isMyTurn()) {
      if (game && myPlayer !== null) {
        const newGame = new GameClass(game);
        const newDiscardDeck = [...newGame.discardDeck, card];
        newGame.discardDeck = newDiscardDeck;
        const newPlayerCards = newGame.players[myPlayer!].cards.filter(
          (c) => c.id !== card.id
        );
        newGame.players[myPlayer!].cards = newPlayerCards;

        setSelectedCard(null);
        onCompleteAction();
        setGame(newGame);
        onUpdateGameGQL(newGame);
      }
    }
  };

  const drawCardFromDeck = () => {
    if (game) {
      const newGame = new GameClass(game);
      const card = newGame.deck[0];
      const newDeck = newGame.deck.slice(1);
      newGame.deck = newDeck;

      const newPlayerCards = [...newGame.players[myPlayer!].cards, card];
      newGame.players[myPlayer!].cards = newPlayerCards;
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const drawCardFromDiscardDeck = () => {
    if (game) {
      const newGame = new GameClass(game);
      const card = game.discardDeck[game.discardDeck.length - 1];
      const newDiscardDeck = game.discardDeck.slice(
        0,
        game.discardDeck.length - 1
      );
      newGame.discardDeck = newDiscardDeck;

      const newPlayerCards = [...newGame.players[myPlayer!].cards, card];
      newGame.players[myPlayer!].cards = newPlayerCards;
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const parseGameData = (game: any) => {
    if (game) {
      const parsedGame: Game = {
        id: game.id,
        code: game.code,
        status: game.status as GameStatus,
        playerTurn: game.playerTurn || 0,
        deck: game.deck ? JSON.parse(game.deck) : [],
        discardDeck: game.discardDeck ? JSON.parse(game.discardDeck) : [],
        players: game.players ? JSON.parse(game.players) : [],
        rounds: game.rounds ? JSON.parse(game.rounds) : [],
        currentRound: game.currentRound || 0,
        gameType: game.gameType || "standard",
      };
      return parsedGame;
    }

    return null;
  };

  const subscribeToGameUpdates = async (code: string) => {
    try {
      const subscription = await client.graphql({
        query: onUpdateGame,
        variables: {
          filter: {
            id: { eq: code },
          },
        },
      });

      subscription.subscribe({
        next: (eventData: any) => {
          if (eventData.data) {
            setGame(parseGameData(eventData.data.onUpdateGame as GetGameQuery));
          }
        },
      });
    } catch (err) {
      console.error("error subscribing to game updates", err);
    }
  };

  const getCurrentRoundWinner = () => {
    if (game) {
      const round = game.rounds[game.currentRound];

      if (round.roundWinner >= 0) {
        return game.players[round.roundWinner].name;
      }
    }
  };

  const getGameByCode = async (code: string) => {
    try {
      const game = await client.graphql({
        query: getGame,
        variables: {
          id: code,
        } as GetGameQueryVariables,
      });

      if (game.data) {
        const parsedGame = parseGameData(game.data.getGame as GetGameQuery);
        setGame(parsedGame);
        if (parsedGame) {
          const player = parsedGame.players.find(
            (player) => player.name === playerId
          );
          if (player) {
            setMyPlayer(player.id);
          }
        }
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
    path += `?code=${gameCode}`;
    navigator.clipboard.writeText(path);
  };

  const onCardInHandClick = (card: Card) => {
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  useEffect(() => {
    if (gameCode) {
      getGameByCode(gameCode);
      subscribeToGameUpdates(gameCode);
    }
  }, [gameCode]);

  useEffect(() => {
    const code = searchParams.get("code");
    setGameCode(code);
  }, [searchParams]);

  useEffect(() => {
    const playerId = searchParams.get("player");
    if (playerId) {
      setPlayerId(playerId);
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
            {gameCode}
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
          {game.status === "open" && myPlayer === null && (
            <>
              <form onSubmit={onAddPlayer}>
                <div>
                  <label>
                    <input
                      className="w-full px-3 py-2 border border-gray-400 rounded-md"
                      type="text"
                      value={playerName}
                      placeholder="Player Name"
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </label>
                  <button
                    className="px-6 py-2 mb-5 bg-blue-300 rounded-md"
                    type="submit"
                  >
                    Add Player
                  </button>
                </div>
              </form>
            </>
          )}

          {game.players.length > 0 && (
            <Players playerTurn={game.playerTurn} players={game.players} />
          )}

          <div className="flex items-center justify-center grow relative flex-col w-full bg-slate-100">
            <NotificationsComponent
              game={game}
              player={getMyPlayer()}
              isPlayerTurn={isMyTurn()}
              currentPlayerAction={getCurrentPlayerAction()}
              currentRound={getCurrnetRound()}
            />

            <div className="w-full">
              {game.status === "in-progress" && (
                <>
                  {getCurrnetRound()?.status === "complete" && (
                    <div>
                      <h2 className="text-center">
                        Round Winner: {getCurrentRoundWinner()}
                      </h2>
                      <HandContainer>
                        {game.players[getCurrnetRound()!.roundWinner].cards.map(
                          (card, index) => {
                            return (
                              <>
                                <div
                                  key={card.id}
                                  style={{ minWidth: "1rem", maxWidth: "6rem" }}
                                  className="relative w-full h-28 mx-2 first-of-type:ml-auto last-of-type:mr-auto"
                                >
                                  <div className="absolute left-0 top-0">
                                    <CardComponent
                                      key={card.id}
                                      card={card}
                                      disabled
                                      size="small"
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

                  {getCurrnetRound()?.status === "in-progress" && (
                    <div className="flex mb-6 justify-center">
                      <div className="mx-1">
                        {game.deck.length > 0 ? (
                          (() => {
                            const card = game.deck[0];
                            return (
                              <>
                                {/* <span>{game.deck.length}</span> */}
                                <CardComponent
                                  key={card.id}
                                  card={card}
                                  onClick={() => onDrawCard()}
                                  hidden
                                  disabled={
                                    !isMyTurn() ||
                                    currentAction?.type !== "draw"
                                  }
                                >
                                  Draw
                                </CardComponent>
                              </>
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
                              <>
                                {/* <span>{game.discardDeck.length}</span> */}
                                <CardComponent
                                  wild={isWildCard(card)}
                                  key={card.id}
                                  card={card}
                                  onClick={onDiscardPileClick}
                                  disabled={!isMyTurn()}
                                />
                              </>
                            );
                          })()
                        ) : (
                          <CardComponent onClick={onDiscardPileClick} />
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="py-4 bg-slate-100 w-full grow-0 border-t-2 border-t-white">
            <div className="flex justify-center">
              {getCurrnetRound()?.status === "complete" && !isLastRound() && (
                <button
                  className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                  onClick={onStartNewRound}
                >
                  Start New Round
                </button>
              )}

              {getCurrnetRound()?.status === "complete" && isLastRound() && (
                <button
                  className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                  onClick={onNewGame}
                >
                  New Game
                </button>
              )}

              {game.status === "open" &&
                getMyPlayer() &&
                getMyPlayer()?.type === "host" &&
                game.players.length >= 2 && (
                  <button
                    className="px-6 py-2 mb-5 bg-blue-300 rounded-md"
                    onClick={onStartGame}
                  >
                    Start Game
                  </button>
                )}

              {getCurrnetRound()?.status === "open" &&
                getCurrnetRound()?.dealer === myPlayer && (
                  <button
                    className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                    onClick={onDealCardsToPlayers}
                  >
                    Deal
                  </button>
                )}

              {game.status === "in-progress" && isMyTurn() && (
                <div className="flex justify-center">
                  {!currentAction && (
                    <>
                      {!getCurrentRoundWinner() && (
                        <button
                          className="px-6 py-2 mb-2 mr-2 bg-red-300 rounded-md"
                          onClick={onClaimRound}
                        >
                          GRANDMA!!!
                        </button>
                      )}
                      <button
                        className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md float-right"
                        onClick={onEndTurn}
                      >
                        End Turn
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative overflow-hidden">
              {selectedCard && (
                <>
                  <div className="absolute -left-4 flex items-center z-10 top-1/2 -translate-y-1/2">
                    <button
                      className="px-2 py-1 mx-1 w-12 h-12 bg-blue-300 rounded-full shadow-md flex items-center justify-center"
                      onClick={() => changeCardOrder(selectedCard, -1)}
                    >
                      <FaAngleLeft />
                    </button>
                  </div>

                  <div className="absolute -right-4 flex items-center z-10 top-1/2 -translate-y-1/2">
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
                {getPlayerCards()?.map((card, index) => {
                  return (
                    <div
                      key={card.id}
                      style={{ minWidth: "2rem", maxWidth: "6rem" }}
                      className="relative w-full h-28 mx-2 first-of-type:ml-auto last-of-type:mr-auto"
                    >
                      <div className="absolute left-0 top-0">
                        <CardComponent
                          selected={selectedCard?.id === card.id}
                          wild={isWildCard(card)}
                          card={card}
                          onClick={() => onCardInHandClick(card)}
                          size="small"
                          index={index}
                        />
                      </div>
                    </div>
                  );
                })}
              </HandContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
