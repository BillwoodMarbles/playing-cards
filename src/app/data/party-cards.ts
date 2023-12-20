import {
  GiAngelOutfit,
  GiBattleAxe,
  GiCoins,
  GiDeerTrack,
  GiNinjaHead,
  GiPerspectiveDiceThree,
  GiPig,
} from "react-icons/gi";
import { GiClown } from "react-icons/gi";
import { MdContentCopy } from "react-icons/md";
import { MdLocalMovies } from "react-icons/md";
import { GiCardJackClubs } from "react-icons/gi";
import { GiGlassShot } from "react-icons/gi";
import {
  FaBookDead,
  FaBoxOpen,
  FaCrown,
  FaDungeon,
  FaFireAlt,
  FaGlassCheers,
  FaHandHoldingHeart,
  FaMask,
  FaPhone,
  FaSkull,
} from "react-icons/fa";
import { TbCircleLetterW } from "react-icons/tb";
import { PiDetectiveBold, PiDiceSixBold } from "react-icons/pi";
import { PiHandCoins } from "react-icons/pi";
import { GoNumber } from "react-icons/go";
import {
  FaExplosion,
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
  QUARTER_SPIN = "Tornado Alley",
  BLACK_JACK = "Black Jack",
  MINI_GOLF = "Mini Golf",
  QUARTER_RACE = "Quarter Race",
  DICE_ROULETTE = "Dice Roulette",
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
  NINJA = "Ninja",
  MOOSE = "Moose",
  SOCIAL = "Social",
  ROLL_CALL = "Roll Call",
  ITS_A_DATE = "It's a Date",
  IMPOSTER = "Imposter Syndrome",
  I_CAN_COUNT_TO_SIX = "I Can Count to Six",
  TELESKETCH = "Tele-Sketch",
  HANG_MAN = "Hangman",
  THAT_WORD_GAME = "That Word Game",
  LAND_MINES = "Land Mines",
  STORY_TIME = "Story Time",
  PIG = "Pig",
  RULE = "Rule",
  HEAVEN = "Heaven",
  DOTS_AND_BOXES = "Dots and Boxes",
  BOSS_BATTLE = "Boss Battle",
}

export type MiniGameRequirements =
  | "none"
  | "cards"
  | "coins"
  | "dice"
  | "shot-glass"
  | "standing"
  | "drawing"
  | "drinking";

export interface MiniGame {
  description: string[];
  title: MiniGameType;
  reward?: string;
  icon: ElementType;
  requirements?: MiniGameRequirements[];
  minPlayers?: number;
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

export const getPartyCardDeckWithConfig = (config: {
  [key in MiniGameType]?: boolean;
}): Card[] => {
  return partyCards.reduce((acc, card) => {
    if (config[card.title]) {
      acc.push({
        id: acc.length,
        name: card.title,
        type: "non-standard",
        status: "none",
      });
    }

    return acc;
  }, [] as Card[]);
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
    requirements: ["cards"],
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
    requirements: ["coins"],
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
    requirements: ["cards"],
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
    requirements: ["cards"],
  },
  {
    title: MiniGameType.QUARTER_RACE,
    description: [
      "All players race to bounce a quarter into a shot glass",
      "Last player to make it is out",
      "Repeat until one player is left",
    ],
    reward: "5 coins",
    icon: FaFlagCheckered,
    requirements: ["coins", "shot-glass"],
  },
  {
    title: MiniGameType.DICE_ROULETTE,
    description: [
      "Each player chooses a number on a die",
      "Roll the die. If it lands on your number, you are out. Keep rolling until one player is left",
      "The last player standing wins",
    ],
    reward: "5 coins",
    icon: GiChaingun,
    requirements: ["dice"],
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
    requirements: ["coins", "shot-glass"],
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
    requirements: ["cards"],
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
    requirements: ["cards"],
  },
  {
    title: MiniGameType.TIPPY_SHOT,
    description: [
      "Place a shot glass right-side up on the edge of the table",
      "At the same time, each players tries to flip the shot glass so it lands upside down on the table",
      "Last player to flip the shot glass is out",
      "Repeat until one player is left",
      "Word of advice: only play with plastic shot glasses...",
    ],
    reward: "10 coins",
    icon: GiGlassShot,
    requirements: ["shot-glass"],
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
    requirements: ["cards"],
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
    requirements: ["coins", "dice"],
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
    requirements: ["cards"],
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
    requirements: ["cards"],
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
    requirements: ["coins", "shot-glass"],
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
    requirements: ["coins"],
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
  {
    title: MiniGameType.NINJA,
    description: ["Play a game of ninja"],
    reward: "1 point",
    icon: GiNinjaHead,
    requirements: ["standing"],
  },
  {
    title: MiniGameType.MOOSE,
    description: [
      "You are now the Moose!",
      "Once per round, you can place your hands on your head like antlers",
      "The last player to do the same takes a drink",
    ],
    reward: "1 drink",
    icon: GiDeerTrack,
    requirements: ["drinking"],
  },
  {
    title: MiniGameType.SOCIAL,
    description: ["Everyone takes a drink!"],
    reward: "1 drink",
    icon: FaGlassCheers,
    requirements: ["drinking"],
  },
  {
    title: MiniGameType.HEAVEN,
    description: ["Point to the sky! Last player to do the same takes a drink"],
    reward: "1 drink",
    icon: GiAngelOutfit,
    requirements: ["drinking"],
  },
  {
    title: MiniGameType.ROLL_CALL,
    description: [
      "Everyone rolls a single die to determine how many drinks they take",
    ],
    reward: "Drink dice value",
    icon: GiPerspectiveDiceThree,
    requirements: ["drinking", "dice"],
  },
  {
    title: MiniGameType.ITS_A_DATE,
    description: ["Choose one person to take a drink with you"],
    reward: "1 drink each",
    icon: FaHandHoldingHeart,
    requirements: ["drinking"],
  },
  {
    title: MiniGameType.RULE,
    description: [
      "Can make up any rule you want",
      "ex: no pointing, no saying names, no swearing, etc.",
    ],
    reward: "1 drink each",
    icon: FaCrown,
    requirements: ["drinking"],
  },
  {
    title: MiniGameType.IMPOSTER,
    description: [
      "Including exactly one joker card, deal a card to each player. The player with the joker is the imposter",
      "The goal is to figure out who the imposter is",
      "At the start of the round, each player can state their case for why they are not the imposter. Each player then votes for who they think the imposter is. The player with the most votes is out and reveals their card",
      "Repeat until there are two players left. If the imposter is not out by the time there are only two players left, the imposter wins",
    ],
    reward: "1 point",
    icon: FaMask,
    requirements: ["cards"],
    minPlayers: 4,
  },
  {
    title: MiniGameType.I_CAN_COUNT_TO_SIX,
    description: [
      "The goal is to roll 1 - 6 in order",
      "Each player takes turns rolling a die",
      "Start by trying to roll a 1, then a 2, then a 3, etc.",
      "Do not move on to the next number until you roll the current number",
      "If you roll your current number, you get to roll again",
      "Whoever gets to 6 first wins",
    ],
    reward: "1 point",
    icon: PiDiceSixBold,
    requirements: ["dice"],
  },
  {
    title: MiniGameType.TELESKETCH,
    description: [
      "The first player writes a phrase or word on a piece of paper",
      "The next player draws a picture of the phrase",
      "The next player writes a phrase based on the picture",
      "Repeat until each player has had a turn",
      "If the round ends on the drawing phase, then the first person to draw writes down the final phrase",
      "For how many words are correct, each player gets a point",
    ],
    reward: "1 point/word",
    icon: FaPhone,
    requirements: ["drawing"],
  },
  {
    title: MiniGameType.HANG_MAN,
    description: [
      "One player picks a word or phrase",
      "Other players take turns guessing letters",
      "If a player guesses a letter correctly, the player who picked the word/phrase writes the letter in the correct spot",
      "After 6 incorrect guesses, the player who picked the word/phrase wins",
      "If the word/phrase is guessed correctly, the player who guessed it wins",
    ],
    reward: "1 point",
    icon: FaSkull,
    requirements: ["drawing"],
  },
  {
    title: MiniGameType.THAT_WORD_GAME,
    description: [
      "One player picks a word and draws as many blanks as there are letters in the word",
      "Other players take turns guessing a word. The host writes the word in the blanks",
      "If a letter is correct but in the wrong spot, the host puts an / over the letter",
      "If a letter is correct and in the right spot, the host puts a O over the letter",
      "Repeat until 6 guesses are made",
      "If the word is guessed correctly, the crew wins. If not, the host wins",
    ],
    reward: "1 point",
    icon: TbCircleLetterW,
    requirements: ["drawing"],
  },
  {
    title: MiniGameType.DOTS_AND_BOXES,
    description: [
      "Draw a 10 x 10 grid of dots",
      "Take turns drawing a line between two dots",
      "If you complete a box, write your initial in the box",
      "The player with the most boxes wins",
    ],
    reward: "1 point",
    icon: FaBoxOpen,
    requirements: ["drawing"],
  },
  {
    title: MiniGameType.LAND_MINES,
    description: [
      "Start by spinning a quarter on the table",
      "Each player takes turns trying flicking the quarter to keep it spinning",
      "If a player knocks over the quarter, they are out, but they get to place their quarter anywhere on the table as an obstacle",
      "Last player standing wins",
    ],
    reward: "1 point",
    icon: FaExplosion,
    requirements: ["coins"],
  },
  {
    title: MiniGameType.STORY_TIME,
    description: [
      "One player starts a story with one word",
      "Each player takes turns repeating the story and adding one word at the end",
      "If a player messes up, they are out",
      "The last player standing wins",
    ],
    reward: "1 point",
    icon: FaBookDead,
  },
  {
    title: MiniGameType.PIG,
    description: [
      "Each player takes turns rolling a die",
      "If you roll a 1, you get 0 points and your turn is over",
      "If you roll a 2 - 6, you add that number to your score and may choose to roll again",
      "Highest score wins",
    ],
    reward: "1 point",
    icon: GiPig,
    requirements: ["dice"],
  },
  {
    title: MiniGameType.BOSS_BATTLE,
    description: [
      "Role-playing time!",
      "One player is the boss and the other players are the adventurers",
      "The boss rolls a die as many times as there are other players. The sum of the rolls is the boss's health",
      "Each adventurer gets one roll. The sum of all of the adventurers' rolls is their attack",
      "If the adventurers' attack is greater than the boss's health, the adventurers win",
    ],
    reward: "1 point",
    icon: FaDungeon,
    requirements: ["dice"],
  },
];
