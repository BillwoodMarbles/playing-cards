import { GameTypes, getGameConfig } from "../data/game-configs";
import { getPartyCardDeck, partyCards } from "../data/party-cards";
import { Card, Game, Player, Round } from "../types";
import { shuffleCards } from "../utils/cards";
import { getCurrentRoundWinner, getNextPlayer } from "../utils/game";

const useGame = (game: Game, player: Player | null) => {
  const resetPlayerHands = () => {
    let newPlayers = [...game.players];
    newPlayers = newPlayers.map((newPlayer) => {
      return { ...newPlayer, cards: [] };
    });
    return newPlayers;
  };

  const newGame = () => {
    const gameConfig = getGameConfig(game.gameType);
    const newGame = {
      ...game,
      ...{
        rounds: gameConfig.rounds,
        code: game.code,
        id: game.id,
        players: game.players,
        gameType: game.gameType,
      },
    };
    newGame.players?.forEach((player) => {
      player.cards = [];
      player.score = 0;
    });
    newGame.lastMove = {
      playerId: player?.id || "",
      action: "new-game",
      card: null,
    };
    return newGame;
  };

  const initializeRound = () => {
    const newGame = { ...game };
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
    newGame.deck = initializeDeck();
    newGame.discardDeck = [];
    newGame.players = resetPlayerHands();

    // set round status to open
    const newRounds = [...newGame.rounds];
    newRounds[newGame.currentRound].status = "open";

    // set dealer to player based on current round
    const dealerIndex = newGame.currentRound % newGame.players.length;
    const currentDealer = newGame.players[dealerIndex];
    newRounds[newGame.currentRound].dealer = currentDealer.id;
    newGame.rounds = newRounds;

    // update current player turn to next player in line
    newGame.playerTurn = getNextPlayerTurn(newGame);

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "start-round",
      card: null,
    };

    return newGame;
  };

  const getNextPlayerTurn = (newGame: Game) => {
    const dealerIndex = newGame.currentRound % newGame.players.length;
    const nextPlayerIndex = (dealerIndex + 1) % newGame.players.length;
    const nextPlayer = newGame.players[nextPlayerIndex];
    return nextPlayer.id;
  };

  const drawCardFromPrimaryDeck = () => {
    const newGame = { ...game };
    const topCard = newGame.deck[newGame.deck.length - 1];

    if (!player) {
      throw new Error("Player not found");
    }

    if (!topCard) {
      throw new Error("No card found in draw deck");
    }

    // set card status
    topCard.status = "visible-deck-draw";

    // remove top card from deck
    newGame.deck = newGame.deck.slice(0, newGame.deck.length - 1);

    // if deck is empty, add discard pule back to deck and re-shuffle
    if (newGame.deck.length === 0) {
      newGame.deck = [...newGame.discardDeck.slice(0, -1)];
      newGame.deck = shuffleCards(newGame.deck);
      newGame.discardDeck = [
        newGame.discardDeck[newGame.discardDeck.length - 1],
      ];
    }

    // add card to player hand
    const newPlayerCards = [...player.cards, topCard];

    let newPlayers = [...newGame.players];
    newPlayers = newPlayers.map((newPlayer) => {
      if (newPlayer.id === player.id) {
        return { ...newPlayer, cards: newPlayerCards };
      }

      return newPlayer;
    });
    newGame.players = newPlayers;

    // set last move
    newGame.lastMove = {
      playerId: player.id,
      card: topCard,
      action: "draw-from-deck",
    };

    return newGame;
  };

  const revealCard = (card: Card) => {
    // set card status to visible
    const newGame = { ...game };
    const newCard = { ...card };
    newCard.status = "visible";

    if (!player) {
      throw new Error("Player not found");
    }

    newGame.deck = newGame.deck.map((_card) => {
      if (_card.id === card.id) {
        return newCard;
      }

      return _card;
    });

    // set last move
    newGame.lastMove = {
      playerId: player?.id,
      card: newCard,
      action: "reveal-card",
    };

    return newGame;
  };

  const burnCardFromPrimaryDeck = () => {
    const newGame = { ...game };
    const topCard = newGame.deck[newGame.deck.length - 1];

    if (!player) {
      throw new Error("Player not found");
    }

    if (!topCard) {
      throw new Error("No card found in draw deck");
    }

    // set card status
    topCard.status = "visible-deck-draw";

    // remove top card from deck
    newGame.deck = newGame.deck.slice(0, newGame.deck.length - 1);

    // if deck is empty, add discard pule back to deck and re-shuffle
    if (newGame.deck.length === 0) {
      newGame.deck = [...newGame.discardDeck.slice(0, -1)];
      newGame.deck = shuffleCards(newGame.deck);
      newGame.discardDeck = [
        newGame.discardDeck[newGame.discardDeck.length - 1],
      ];
    }

    // add card to discard deck
    newGame.discardDeck = [...newGame.discardDeck, topCard];

    // set last move
    newGame.lastMove = {
      playerId: player.id,
      card: topCard,
      action: "burn-from-deck",
    };

    return newGame;
  };

  const drawCardFromDiscardDeck = () => {
    const newGame = { ...game };
    const topCard = newGame.discardDeck[newGame.discardDeck.length - 1];

    if (!player) {
      throw new Error("Player not found");
    }

    if (!topCard) {
      throw new Error("No card found in discard deck");
    }

    // set card status
    topCard.status = "visible-discard-draw";

    // remove top card from deck
    newGame.discardDeck = newGame.deck.slice(0, newGame.deck.length - 1);

    // add card to player hand
    const newPlayerCards = [...player.cards, topCard];

    let newPlayers = [...newGame.players];
    newPlayers = newPlayers.map((newPlayer) => {
      if (newPlayer.id === player.id) {
        return { ...newPlayer, cards: newPlayerCards };
      }

      return newPlayer;
    });
    newGame.players = newPlayers;

    // set last move
    newGame.lastMove = {
      playerId: player.id,
      card: topCard,
      action: "draw-from-discard",
    };

    return newGame;
  };

  const getNewDeck = () => {
    let newDeck: Card[] = [];
    const { deckCount, deckType } = getGameConfig(game.gameType);

    if (deckType === "standard-with-jokers") {
      const cardsPerDeck = 52;

      for (let i = 0; i < deckCount; i++) {
        for (let j = 0; j < cardsPerDeck; j++) {
          newDeck.push({
            id: i * cardsPerDeck + j,
            suit: Math.floor(j / 13),
            value: j % 13,
            type: "standard",
          });
        }
      }

      if (deckType === "standard-with-jokers") {
        for (let i = 0; i < deckCount * 2; i++) {
          newDeck.push({
            id: deckCount * cardsPerDeck + i,
            suit: 4,
            value: 13,
            type: "standard",
          });
        }
      }
    }

    if (deckType === "card-party") {
      newDeck = getPartyCardDeck();
    }

    return newDeck;
  };

  const initializeDeck = () => {
    const deck = shuffleCards(getNewDeck());
    return deck;
  };

  const startGame = () => {
    const gameConfig = getGameConfig(game.gameType);

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
    const newGame = initializeRound();
    newGame.status = "in-progress";

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "new-game",
      card: null,
    };

    return newGame;
  };

  const dealCardsToPlayers = () => {
    const newGame = { ...game };
    const currentRound = getCurrentRound();

    newGame.deck = initializeDeck();

    if (currentRound.drawCount) {
      newGame.players?.forEach((player) => {
        player.cards = newGame.deck.slice(0, currentRound?.drawCount);

        if (newGame.gameType === GameTypes.MINI_GOLF) {
          player.cards.forEach((card) => {
            card.status = "hidden";
          });
        } else {
          player.cards.forEach((card) => {
            card.status = "none";
          });
        }
        newGame.deck = newGame.deck.slice(currentRound?.drawCount);
      });
    }

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
      playerId: player?.id || "",
      action: "new-deal",
      card: card,
    };

    return newGame;
  };

  const endTurn = () => {
    const newGame = { ...game };
    const currentPlayerTurn = newGame.playerTurn;
    const nextPlayer = getNextPlayer(game);
    const currentRound = getCurrentRound();
    const roundWinner = getCurrentRoundWinner(game);

    if (!nextPlayer || !currentRound) {
      throw new Error("no player or round found");
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
      const isLastTurn = getCurrentRound()?.status === "last-turn";

      if (isLastTurn) {
        if (nextPlayer.id === roundWinner?.id) {
          newGame.rounds[newGame.currentRound].status = "complete";
        }
      }
    }

    // set next player turn
    newGame.playerTurn = nextPlayer.id;

    // game specific actions
    if (game.gameType === GameTypes.MINI_GOLF) {
      // lock all visible cards
      newGame.players.forEach((_player) => {
        _player.cards.forEach((card) => {
          if (
            _player.id === player?.id &&
            (card.status === "visible" ||
              card.status === "visible-deck-draw" ||
              card.status === "visible-discard-draw")
          ) {
            card.status = "visible-never-discard";
          }
        });
      });
    } else {
      newGame.players.forEach((_player) => {
        _player.cards.forEach((card) => {
          if (
            _player.id === player?.id &&
            card.status === "visible-discard-draw"
          ) {
            card.status = "visible";
          }
        });
      });
    }

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "end-turn",
      card: null,
    };

    return newGame;
  };

  const claimRound = () => {
    // claim round
    const newGame = { ...game };
    newGame.rounds[newGame.currentRound].roundWinner = newGame.playerTurn;
    newGame.rounds[newGame.currentRound].status = "last-turn";
    newGame.playerTurn = getNextPlayer(game)?.id || game.playerTurn;

    newGame.lastMove = {
      playerId: player?.id || "",
      action: "claim-round",
      card: null,
    };

    // update game state
    return newGame;
  };

  const getCurrentRound = () => {
    return game.rounds[game.currentRound];
  };

  return {
    burnCardFromPrimaryDeck,
    drawCardFromDiscardDeck,
    drawCardFromPrimaryDeck,
    dealCardsToPlayers,
    claimRound,
    initializeRound,
    newGame,
    revealCard,
    startGame,
    endTurn,
  };
};

export default useGame;
