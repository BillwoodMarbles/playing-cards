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
import { Card, Game, GameStatus, Player, PlayerAction, Round } from "../types";
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
const gameRounds: Round[] = [
  {
    id: 0,
    status: "in-progress",
    score: {},
    drawCount: 3,
    roundWinner: -1,
    dealer: -1,
  },
  {
    id: 1,
    status: "in-progress",
    score: {},
    drawCount: 4,
    roundWinner: -1,
    dealer: -1,
  },
  {
    id: 2,
    status: "in-progress",
    score: {},
    drawCount: 5,
    roundWinner: -1,
    dealer: -1,
  },
];

interface PlayerCard extends Card {
  order: number;
}

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

      const newGame = { ...game };
      newGame.players.push(newPlayer);
      setGame(newGame);
      setPlayerId(newPlayer.name);
      setMyPlayer(newPlayer.id);
      onUpdateGameGQL(newGame);
      router.push(`/play?code=${game?.code}&player=${newPlayer.name}`);
    }
  };

  const getPlayerName = (playerId: string | null) => {
    if (game && playerId !== null) {
      const player = game.players.find((player) => player.name === playerId);
      if (player) {
        return player.name;
      }
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

  const getNewDeck = () => {
    const newDeck = [];
    for (let i = 0; i < 52; i++) {
      newDeck.push({ id: i, suit: Math.floor(i / 13), value: i % 13 });
    }
    // add jokers to deck
    newDeck.push({ id: 52, suit: 4, value: 13 });
    newDeck.push({ id: 53, suit: 4, value: 13 });
    return newDeck;
  };

  const shuffleDeck = (deck: Card[]) => {
    const newDeck = [...deck];
    for (let i = 0; i < newDeck.length; i++) {
      const j = Math.floor(Math.random() * newDeck.length);
      const temp = newDeck[i];
      newDeck[i] = newDeck[j];
      newDeck[j] = temp;
    }
    return newDeck;
  };

  const onSelectPlayer = (playerId: number) => {
    setMyPlayer(playerId);
    router.push(`/play?code=${game?.code}&player=${playerId}`);
  };

  const onNewGame = () => {
    // reset game
    if (game) {
      const newGame = { ...game };
      newGame.deck = [];
      newGame.discardDeck = [];
      newGame.playerTurn = 0;
      newGame.status = "open";
      newGame.rounds = gameRounds;
      newGame.currentRound = 0;
      newGame.gameType = "grandma";
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

  const initializeRound = (game: Game): Game => {
    const newGame = { ...game };
    newGame.deck = shuffleDeck(getNewDeck());
    newGame.discardDeck = [];
    newGame.players?.forEach((player) => {
      player.cards = [];
    });

    // set round status to in-progress
    const newRounds = [...newGame.rounds];
    newRounds[newGame.currentRound].status = "open";

    // if first round set dealer to host player
    newRounds[newGame.currentRound].dealer =
      newGame.currentRound % newGame.players.length;

    newGame.rounds = newRounds;

    newGame.playerTurn = (newGame.currentRound + 1) % newGame.players.length;

    return newGame;
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

      let newGame = { ...game };
      newGame.status = "in-progress";
      newGame = initializeRound(newGame);

      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const onEndTurn = () => {
    if (game) {
      const newGame = { ...game };
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
      const newGame = { ...game };
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
      let newGame = { ...game };
      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length;
      newGame = initializeRound(newGame);
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
        if (!newPlayerCardSortOrder.find((id) => id === card.id)) {
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
      newSortOrder.splice(cardIndex, 1);
      newSortOrder.splice(cardIndex + orderAdjustment, 0, card.id);
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
      const newGame = { ...game };
      newGame.deck = shuffleDeck(getNewDeck());
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
        const newGame = { ...game };
        const newDiscardDeck = [...game.discardDeck, card];
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
      const newGame = { ...game };
      const card = game.deck[0];
      const newDeck = game.deck.slice(1);
      newGame.deck = newDeck;

      const newPlayerCards = [...game.players[myPlayer!].cards, card];
      newGame.players[myPlayer!].cards = newPlayerCards;
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const drawCardFromDiscardDeck = () => {
    if (game) {
      const newGame = { ...game };
      const card = game.discardDeck[game.discardDeck.length - 1];
      const newDiscardDeck = game.discardDeck.slice(
        0,
        game.discardDeck.length - 1
      );
      newGame.discardDeck = newDiscardDeck;

      const newPlayerCards = [...game.players[myPlayer!].cards, card];
      newGame.players[myPlayer!].cards = newPlayerCards;
      setGame(newGame);
      onUpdateGameGQL(newGame);
    }
  };

  const getCardSuitAndValue = (card: number) => {
    const suit = Math.floor(card / 13);
    const value = card % 13;
    const id = card;
    return { suit, value, id };
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

  const getNotifcations = () => {
    const notifications = [];

    if (game?.status === "open") {
      if (game.players.length < 2) {
        notifications.push(
          <div className="text-center">Waiting for players...</div>
        );
      } else {
        if (getMyPlayer()?.type === "host") {
          notifications.push(<div className="text-center">Ready to start</div>);
        } else {
          notifications.push(
            <div className="text-center">Waiting for host to start</div>
          );
        }
      }
    } else if (game?.status === "in-progress") {
      if (getCurrnetRound()?.status === "complete") {
        if (isLastRound()) {
          notifications.push(<div className="text-center">Game Over</div>);
        } else {
          notifications.push(
            <div className="text-center">
              Round Over. Waiting for host to start new round
            </div>
          );
        }
      } else if (getCurrnetRound()?.status === "open") {
        if (getCurrnetRound()?.dealer === myPlayer) {
          notifications.push(<div className="text-center">Ready to deal</div>);
        } else {
          notifications.push(
            <div className="text-center">Waiting for dealer</div>
          );
        }
      } else {
        if (getCurrentRoundWinner()) {
          notifications.push(
            <div className="text-center">
              GRANDMA!!! - {getCurrentRoundWinner()}
            </div>
          );
        }

        if (isMyTurn()) {
          notifications.push(getCurrentPlayerAction()?.description);
        } else {
          notifications.push(
            <div className="text-center">
              {game.players[game.playerTurn]?.name}&lsquo;s Turn
            </div>
          );
        }
      }
    }

    return notifications;
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
      <div className="px-4 py-2 flex items-center w-full">
        <div className="w-1/4">
          {gameCode}
          <button className="ml-2" onClick={copyCurrentRouteToClipboard}>
            Share
          </button>
        </div>
        <h1 className="text-2xl text-center grow">
          Grandma (
          {getCurrnetRound() && getCurrnetRound()!.id >= 0
            ? getCurrnetRound()!.id + 1
            : "-"}{" "}
          of {game?.rounds.length})
        </h1>
        <div className="w-1/4 text-right">
          <h2>{getPlayerName(playerId)}</h2>
        </div>
      </div>

      {game && (
        <>
          {game.status === "open" && myPlayer === null && (
            <>
              <form onSubmit={onAddPlayer}>
                <div>
                  <label>
                    <input
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
            <>
              <div className="p-3 bg-slate-100 mb-3 w-full">
                <h2 className="text-sm text-center">Players</h2>
                <ul className="flex justify-center">
                  {game.players.map((player) => {
                    return (
                      <li key={player.id} className="mx-1">
                        <a href="#" onClick={() => onSelectPlayer(player.id)}>
                          {player.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          <div className="flex justify-center px-4 py-2 rounded-md flex-col items-center">
            {getNotifcations().map((notification) => notification)}
          </div>

          <div className="flex items-center justify-center grow">
            {game.status === "in-progress" && (
              <>
                {getCurrnetRound()?.status === "complete" && (
                  <div>
                    <h2 className="text-center">
                      Round Winner: {getCurrentRoundWinner()}
                    </h2>
                    <div className="flex justify-center w-full flex-wrap pr-14">
                      {game.players[getCurrnetRound()!.roundWinner].cards.map(
                        (card, index) => {
                          return (
                            <>
                              <CardComponent
                                key={card.id}
                                card={card}
                                disabled
                              />
                            </>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {getCurrnetRound()?.status === "in-progress" && (
                  <div className="flex mb-6 justify-center">
                    <div className="w-24 mx-1">
                      {game.deck.length > 0 ? (
                        (() => {
                          const card = game.deck[0];
                          return (
                            <CardComponent
                              key={card.id}
                              card={card}
                              onClick={() => onDrawCard()}
                              hidden
                              disabled={
                                !isMyTurn() || currentAction?.type !== "draw"
                              }
                            >
                              Draw
                            </CardComponent>
                          );
                        })()
                      ) : (
                        <CardComponent disabled />
                      )}
                    </div>
                    <div className="w-24 mx-1">
                      {game.discardDeck.length > 0 &&
                      game.discardDeck[game.discardDeck.length - 1] ? (
                        (() => {
                          const card =
                            game.discardDeck[game.discardDeck.length - 1];
                          return (
                            <CardComponent
                              wild={isWildCard(card)}
                              key={card.id}
                              card={card}
                              onClick={onDiscardPileClick}
                              disabled={!isMyTurn()}
                            />
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

          <div className="pt-4 px-3 bg-slate-100 w-full">
            {getCurrnetRound()?.status === "complete" && !isLastRound() && (
              <div className="flex mb-6 justify-center">
                <button
                  className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                  onClick={onStartNewRound}
                >
                  Start New Round
                </button>
              </div>
            )}

            {getCurrnetRound()?.status === "complete" && isLastRound() && (
              <div className="flex mb-6 justify-center">
                <button
                  className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                  onClick={onNewGame}
                >
                  New Game
                </button>
              </div>
            )}

            {game.status === "open" &&
              getMyPlayer() &&
              getMyPlayer()?.type === "host" &&
              game.players.length >= 2 && (
                <div className="flex justify-center">
                  <button
                    className="px-6 py-2 mb-5 bg-blue-300 rounded-md"
                    onClick={onStartGame}
                  >
                    Start Game
                  </button>
                </div>
              )}

            {getCurrnetRound()?.status === "open" &&
              getCurrnetRound()?.dealer === myPlayer && (
                <div className="flex justify-center">
                  <button
                    className="px-6 py-2 mb-2 mr-2 bg-blue-300 rounded-md"
                    onClick={onDealCardsToPlayers}
                  >
                    Deal
                  </button>
                </div>
              )}

            {game.status === "in-progress" && isMyTurn() && (
              <div className="mb-6 flex justify-center">
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

            {selectedCard && (
              <div className="flex justify-center mb-4">
                <button
                  className="px-2 py-1 mx-1 bg-blue-300 rounded-md"
                  onClick={() => changeCardOrder(selectedCard, -1)}
                >
                  Left
                </button>
                <button
                  className="px-2 py-1 mx-1 bg-blue-300 rounded-md"
                  onClick={() => changeCardOrder(selectedCard, 1)}
                >
                  Right
                </button>
              </div>
            )}

            <div
              ref={wrapperRef}
              className="flex justify-center w-full flex-wrap pr-14 overflow-hidden relative"
            >
              {getPlayerCards()?.map((card, index) => {
                return (
                  <>
                    <CardComponent
                      selected={selectedCard?.id === card.id}
                      wild={isWildCard(card)}
                      key={card.id}
                      card={card}
                      onClick={() => setSelectedCard(card)}
                    />
                  </>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
