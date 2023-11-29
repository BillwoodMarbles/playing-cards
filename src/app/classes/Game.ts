import { Card, Game, GameStatus, Player, Round } from "../types";

export class GameClass {
  id: string;
  code: string;
  players: Player[];
  deck: Card[];
  discardDeck: Card[];
  playerTurn: number;
  status: GameStatus;
  rounds: Round[];
  currentRound: number;
  gameType: string;

  constructor(game?: Partial<Game>) {
    this.id = game?.id || "";
    this.code = game?.code || "";
    this.players = game?.players || [];
    this.deck = game?.deck || [];
    this.discardDeck = game?.discardDeck || [];
    this.playerTurn = game?.playerTurn || 0;
    this.status = game?.status || "open";
    this.rounds = game?.rounds || [];
    this.currentRound = game?.currentRound || 0;
    this.gameType = game?.gameType || "";
  }

  getNewDeck() {
    const cardsPerDeck = 52;
    const deckCount = 2;
    const newDeck = [];
    for (let i = 0; i < deckCount; i++) {
      for (let j = 0; j < cardsPerDeck; j++) {
        newDeck.push({
          id: i * cardsPerDeck + j,
          suit: Math.floor(j / 13),
          value: j % 13,
        });
      }
    }

    for (let i = 0; i < deckCount * 2; i++) {
      newDeck.push({ id: deckCount * cardsPerDeck + i, suit: 4, value: 13 });
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

    // if first round set dealer to host player
    newRounds[this.currentRound].dealer =
      this.currentRound % this.players.length;

    this.rounds = newRounds;

    this.playerTurn = (this.currentRound + 1) % this.players.length;
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
