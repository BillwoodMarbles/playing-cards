import { GameTypes, getGameConfig } from "../data/game-configs";
import { Card, Game, GameStatus, Player, PlayerMove, Round } from "../types";

export class GameClass {
  id: string;
  code: string;
  players: Player[];
  deck: Card[];
  discardDeck: Card[];
  playerTurn: string;
  status: GameStatus;
  rounds: Round[];
  currentRound: number;
  gameType: GameTypes;
  lastMove: PlayerMove | null;

  constructor(game?: Partial<Game>) {
    this.id = game?.id || "";
    this.code = game?.code || "";
    this.players = game?.players || [];
    this.deck = game?.deck || [];
    this.discardDeck = game?.discardDeck || [];
    this.playerTurn = game?.playerTurn || "";
    this.status = game?.status || "open";
    this.lastMove = game?.lastMove || null;

    if (!game?.rounds && game?.gameType) {
      const config = getGameConfig(game.gameType);
      this.rounds = config.rounds;
    } else {
      this.rounds = game?.rounds || [];
    }

    this.currentRound = game?.currentRound || 0;
    this.gameType = game?.gameType || GameTypes.GRANDMA;
  }

  getNewDeck() {
    const cardsPerDeck = 52;
    const newDeck = [];
    const { deckCount, deckType } = getGameConfig(this.gameType);

    for (let i = 0; i < deckCount; i++) {
      for (let j = 0; j < cardsPerDeck; j++) {
        newDeck.push({
          id: i * cardsPerDeck + j,
          suit: Math.floor(j / 13),
          value: j % 13,
        });
      }
    }

    if (deckType === "standard-with-jokers") {
      for (let i = 0; i < deckCount * 2; i++) {
        newDeck.push({ id: deckCount * cardsPerDeck + i, suit: 4, value: 13 });
      }
    }

    return newDeck;
  }

  initializeDeck() {
    this.deck = this.getNewDeck();
    this.shuffleDeck();
  }

  initializeRound() {
    this.initializeDeck();
    this.discardDeck = [];
    this.players?.forEach((player) => {
      player.cards = [];
    });

    // set round status to in-progress
    const newRounds = [...this.rounds];
    newRounds[this.currentRound].status = "open";

    // set dealer to player based on current round
    const dealerIndex = this.currentRound % this.players.length;
    const currentDealer = this.players[dealerIndex];
    newRounds[this.currentRound].dealer = currentDealer.id;

    this.rounds = newRounds;

    const nextPlayerIndex = (dealerIndex + 1) % this.players.length;
    const nextPlayer = this.players[nextPlayerIndex];
    this.playerTurn = nextPlayer.id;
  }

  shuffleDeck() {
    const newDeck = [...this.deck];

    for (let i = 0; i < newDeck.length; i++) {
      const j = Math.floor(Math.random() * newDeck.length);
      const temp = newDeck[i];
      newDeck[i] = newDeck[j];
      newDeck[j] = temp;
    }

    this.deck = newDeck;
  }
}
