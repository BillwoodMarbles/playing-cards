import { GiBattleAxe, GiCoins } from "react-icons/gi";
import { GiClown } from "react-icons/gi";
import { MdContentCopy } from "react-icons/md";
import { MdLocalMovies } from "react-icons/md";
import { GiCardJackClubs } from "react-icons/gi";
import { GiGlassShot } from "react-icons/gi";
import { FaFireAlt } from "react-icons/fa";
import { PiDetectiveBold } from "react-icons/pi";
import { PiHandCoins } from "react-icons/pi";
import { GoNumber } from "react-icons/go";
import {
  FaFlagCheckered,
  FaGolfBallTee,
  FaHandScissors,
  FaHouse,
  FaLayerGroup,
} from "react-icons/fa6";
import { CgCardSpades } from "react-icons/cg";
import { LuBrain } from "react-icons/lu";
import { FaHand } from "react-icons/fa6";
import { SiAudiomack } from "react-icons/si";
import { GiTwister } from "react-icons/gi";
import { GiChaingun } from "react-icons/gi";
import { GiSilverBullet } from "react-icons/gi";
import { ElementType } from "react";
import { Card } from "../types";

export enum MiniGameType {
  MIND_MELD = "Mind Meld",
  NEVER_HAVE_I_EVER = "Never Have I Ever",
  ROCK_PAPER_SCISSORS = "Rock Paper Scissors",
  HOUSE_OF_CARDS = "House of Cards",
  CATEGORIES = "Categories",
  RHYME_TIME = "Rhyme Time",
  QUARTER_SPIN = "Quarter Spin",
  BLACK_JACK = "Black Jack",
  MINI_GOLF = "Mini Golf",
  QUARTER_RACE = "Quarter Race",
  SPINNER_ROULETTE = "Spinner Roulette",
  QUARTER_ATTACK = "Quarter Attack",
  IM_THE_JOKER_BABY = "I'm the Joker, Baby",
  THE_PERFECT_MATCH = "The Perfect Match",
  TIPPY_SHOT = "Tippy-Shot",
  YOU_CAN_QUOTE_ME = "You Can Quote Me!",
  SLAP_JACK = "Slap-Jack",
  PENNIES = "Pennies!!!",
  SMOKE_OR_FIRE = "Smoke or Fire",
  WHAT_AM_I = "What Am I?",
  ONE_IN_THE_CHAMBER = "One in the Chamber",
  A_COIN_IN_THE_HAND = "A Coin in the Hand",
  LOSING_COUNT = "Losing Count",
}

export interface MiniGame {
  description: string[];
  title: MiniGameType;
  reward?: string;
  icon: ElementType;
}

export const getMiniGameByTitle = (title: MiniGameType) => {
  return partyCards.find((card) => card.title === title);
};

export const getPartyCardDeck = (): Card[] => {
  return partyCards.map((card, index) => {
    return {
      id: index,
      name: card.title,
      type: "non-standard",
      status: "none",
    };
  });
};

export const partyCards: MiniGame[] = [
  {
    title: MiniGameType.MIND_MELD,
    description: [
      "The goal is to say the same word at the same time",
      "On the count of three, two players say whatever one word comes to mind",
      "Rotate one player clockwise and repeat until two players say the same word",
      "hint: try to find a connecting word between the two words previously said",
    ],
    reward: "5 coins each",
    icon: LuBrain,
  },
  {
    title: MiniGameType.NEVER_HAVE_I_EVER,
    description: [
      "Each player starts with 15 coins",
      "Each player takes turns saying something they have never done",
      "If another player has done that thing, they lose 5 coins",
      "If no one has done that thing, the player who said it loses 5 coins",
      "The first player to lose all their coins is out",
    ],
    reward: "Remaining coins",
    icon: FaHand,
  },
  {
    title: MiniGameType.ROCK_PAPER_SCISSORS,
    description: [
      "Players face off in a rock paper scissors tournament",
      "If even players, pair off and play. Winner of each pair plays each other",
      "If odd players, one player sits out each round. Winner of each round plays the player who sat out",
      '"Rock, Paper, Scissors, Shoot!"',
    ],

    reward: "10 coins",
    icon: FaHandScissors,
  },
  {
    description: [
      "Race to build a house of cards using 7 cards",
      "First player to build a house wins",
    ],
    title: MiniGameType.HOUSE_OF_CARDS,
    reward: "5 coins",
    icon: FaHouse,
  },
  {
    description: [
      "One player picks a category and names one thing in that category",
      "Each player takes turns naming items in the cateogry",
      "If a player can't name something or repeats an item, they are out",
      "The last player standing wins",
    ],
    title: MiniGameType.CATEGORIES,
    reward: "5 coins",
    icon: FaLayerGroup,
  },
  {
    title: MiniGameType.RHYME_TIME,
    description: [
      "One player picks a word",
      "Each player takes turns saying a word that rhymes with the original word",
      "If a player can't think of a word or repeats a word, they are out",
      "The last player standing wins",
    ],
    reward: "5 coins",
    icon: SiAudiomack,
  },
  {
    title: MiniGameType.QUARTER_SPIN,
    description: [
      "All players spin a quarter at the same time",
      "The last player with a spinning quarter wins",
    ],
    reward: "5 coins",
    icon: GiTwister,
  },
  {
    title: MiniGameType.BLACK_JACK,
    description: [
      "Each player is dealt two cards",
      "Each player can choose to hit or stay",
      "The player with the highest hand wins",
    ],
    reward: "5 coins",
    icon: CgCardSpades,
  },
  {
    title: MiniGameType.MINI_GOLF,
    description: [
      "Each player is dealt four cards face down",
      "At the beginning of the game, players can look at two of their cards",
      "Each turn, players must flip one of their cards face up",
      "Players can choose to draw a card from the deck or the discard pile and replace one of their face down cards",
      "Once all cards are face up, the player with the lowest score wins",
    ],
    reward: "5 coins",
    icon: FaGolfBallTee,
  },
  {
    title: MiniGameType.QUARTER_RACE,
    description: [
      "All players race to bounce a quarter into a shot glass",
      "The first player to make it wins 10 coins",
      "All other players who make it win 5 coins",
      "Last player to make it gets nothing",
    ],
    reward: "10 / 5 coins",
    icon: FaFlagCheckered,
  },
  {
    title: MiniGameType.SPINNER_ROULETTE,
    description: [
      "Each player chooses a number on the spinner",
      "Spin the spinner",
      "If the spinner lands on your number, you are out",
      "The last player standing wins",
    ],
    reward: "5 coins",
    icon: GiChaingun,
  },
  {
    title: MiniGameType.QUARTER_ATTACK,
    description: [
      "Two players on opposite sides of the table try to bounce a quarter into a shot glass",
      "If you make it, pass the quarter to the next player",
      "If the person to your right makes it before you, you are out",
      "The last player standing wins",
    ],
    reward: "5 coins",
    icon: GiBattleAxe,
  },
  {
    title: MiniGameType.IM_THE_JOKER_BABY,
    description: [
      "Including exactly one joker card, lay down as many cards as there are players, face down",
      "Each player takes turns flipping a card",
      "If you flip a joker, you are out",
      "Remove a non-joker card and reshuffle",
      "The last player standing wins",
    ],
    reward: "5 coins",
    icon: GiClown,
  },
  {
    title: MiniGameType.THE_PERFECT_MATCH,
    description: [
      "Lay down twice as many cards as there are players, face down",
      "Each player takes turns flipping two cards",
      "If you flip a pair, you get to keep the pair",
      "If you don't flip a pair, flip the cards back over",
      "The player with the most pairs wins",
    ],
    reward: "5 coins",
    icon: MdContentCopy,
  },
  {
    title: MiniGameType.TIPPY_SHOT,
    description: [
      "Place a shot glass right-side up on the edge of the table",
      "At the same time, each players tries to flip the shot glass so it lands upside down on the table",
      "Last player to flip the shot glass is out",
      "Repeat until one player is left",
    ],
    reward: "10 coins",
    icon: GiGlassShot,
  },
  {
    title: MiniGameType.YOU_CAN_QUOTE_ME,
    description: [
      "Each player takes turns quoting any movie they want",
      "All other must race to guess the movie the quote is from",
      "First player to guess correctly wins 5 coins",
      "If no one guesses correctly, the player who quoted loses 5 coins",
      "Continue until each player has given one movie quiote",
    ],
    reward: "5 coins per point won",
    icon: MdLocalMovies,
  },
  {
    title: MiniGameType.SLAP_JACK,
    description: [
      "Players take turns flipping cards from the deck",
      "If a Jack is flipped, the first player to slap the card wins",
    ],
    reward: "5 coins",
    icon: GiCardJackClubs,
  },
  {
    title: MiniGameType.PENNIES,
    description: [
      "Each player gets one quarter",
      "Take turns rolling a die",
      "1 - 3: nothing happens",
      "4 - add quarter to pot",
      "5 - pass quarter to left",
      "6 - pass quarter to right",
      "Last player with a quarter wins",
    ],
    reward: "5 coins per quarter in hand",
    icon: GiCoins,
  },
  {
    title: MiniGameType.SMOKE_OR_FIRE,
    description: [
      "Start with 20 coins",
      "Play a game of Smoke or Fire",
      "If you do not guess each round correctly, you lose 5 coins",
    ],
    reward: "Remaining coins in hand",
    icon: FaFireAlt,
  },
  {
    title: MiniGameType.WHAT_AM_I,
    description: [
      "Each player draws a card and places it on their forehead, face out",
      "Take turns guessing the card on your forehead",
      "If you guess incorrectly, the other players tell you if your card is higher or lower",
      "You get one guess per turn",
      "Last player to guess their card loses",
    ],
    reward: "5 coins",
    icon: PiDetectiveBold,
  },
  {
    title: MiniGameType.ONE_IN_THE_CHAMBER,
    description: [
      "Each player gets one shot glass that represents their life",
      "One player attempts to bounce a quarter into a shot glass of another player",
      "If the player makes it, the shot glass is removed from the game and the player who lost it is out. The player who made it gets to go again",
      "If the player misses, the player who was attacked gets to go",
      "Last player with a shot glass wins",
    ],
    reward: "10 coins",
    icon: GiSilverBullet,
  },
  {
    title: MiniGameType.A_COIN_IN_THE_HAND,
    description: [
      "Each player decides to hold a coin in their hand or not (do not show other players)",
      "On your turn, you tell the group if the coin is in your hand or not",
      "Other players must come to a consensus on whether you are telling the truth or not",
      "If they guess correctly, they win 5 coins each",
      "If they guess incorrectly, you gain 5 coins",
      "Repeat until each player has had a turn",
    ],
    reward: "10 coins",
    icon: PiHandCoins,
  },
  {
    title: MiniGameType.LOSING_COUNT,
    description: [
      "Players work together to count to 10, players take turns saying the next number",
      "The player who says the last number must replace an existing number with anything they want besides the number itself",
    ],
    reward: "10 coins",
    icon: GoNumber,
  },
];
