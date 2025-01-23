import {
  GiChaingun,
  GiDevilMask,
  GiGhost,
  GiGloves,
  GiHidden,
  GiMagicLamp,
  GiMushroom,
  GiNinjaHead,
  GiOpenTreasureChest,
  GiPoison,
  GiSlicedMushroom,
  GiSuperMushroom,
  GiTwister,
} from 'react-icons/gi'
import {
  Card,
  CardDeck,
  DeckType,
  ItemCard,
  MiniGameCard,
} from '../_types/types'
import { CgBell, CgDice2, CgDice3, CgStopwatch } from 'react-icons/cg'
import { PiHandCoins, PiPhone } from 'react-icons/pi'
import { MdPlumbing, MdQuestionAnswer, MdQuestionMark } from 'react-icons/md'
import {
  FaDog,
  FaDungeon,
  FaHandScissors,
  FaHorse,
  FaLayerGroup,
} from 'react-icons/fa'
import { FaBomb, FaStar } from 'react-icons/fa6'
import { TbMoneybag } from 'react-icons/tb'
import { LuBrain, LuCircleDashed } from 'react-icons/lu'
import { FaHand } from 'react-icons/fa6'
import { SiAudiomack } from 'react-icons/si'
import { GoNumber } from 'react-icons/go'

export enum MiniGameType {
  MIND_MELD = 'Mind Meld',
  NEVER_HAVE_I_EVER = 'Never Have I Ever',
  ROCK_PAPER_SCISSORS = 'Rock Paper Scissors',
  CATEGORIES = 'Categories',
  RHYME_TIME = 'Rhyme Time',
  QUARTER_SPIN = 'Tornado Alley',
  DICE_ROULETTE = 'Dice Roulette',
  COIN_DARTS = 'Coin Darts',
  WHAT_ARE_YOU_DOING = 'What Are You Doing?',
  ONE_IN_THE_CHAMBER = 'One in the Chamber',
  A_COIN_IN_THE_HAND = 'A Coin in the Hand',
  LOSING_COUNT = 'Losing Count',
  NINJA = 'Ninja',
  BOSS_BATTLE = 'Boss Battle',
  HIDE_AND_SEEK = 'Hide and Seek',
  CLOCK_STOPERS = 'Clock Stoppers',
  HORSE_RACE = 'Horse Race',
  HOT_POTATO = 'Hot Potato',
}

export const MiniGamesAllVSALL: MiniGameCard[] = [
  {
    name: MiniGameType.MIND_MELD,
    description: 'Say the same word at the same time',
    fullDescription: [
      'The goal is to say the same word at the same time.',
      'On the count of three, the drawing player and the player to their left say whatever one word comes to mind.',
      'Rotate one player clockwise and repeat until two players say the same word.',
      'You cannot repeat a word that has already been said.',
      'Hint: try to find a connecting word between the two words previously said.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: LuBrain,
    reward: 10,
    requirements: [],
  },
  {
    name: MiniGameType.HOT_POTATO,
    description: '',
    fullDescription: [
      'Start a timer for 30 seconds and hide the timer.',
      'Pass a player token around the group clockwise.',
      'If the timer goes off while you are holding the coin, you are out.',
      'Repeat until one player is left.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaBomb,
    reward: 10,
    requirements: ['coins'],
  },
  {
    name: MiniGameType.NEVER_HAVE_I_EVER,
    description: '',
    fullDescription: [
      'Each player starts with 3 fingers up.',
      'Takes turns saying something you have never done.',
      'If another player has done that thing, they put a finger down.',
      'If no one has done that thing, the player who said it puts a finger down.',
      'The first player to put all fingers down loses and the game ends.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaHand,
    reward: 10,
    requirements: [],
  },
  {
    name: MiniGameType.CATEGORIES,
    description: '',
    fullDescription: [
      'The drawing player picks a category (ex: breakfast cereal) and names one thing in that category.',
      'Moving clockwise, players take turns naming an item in the cateogry.',
      'If a you cannot name something or repeat an item thats already been said, you are out.',
      'The last player standing wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaLayerGroup,
    reward: 10,
    requirements: [],
  },
  {
    name: MiniGameType.RHYME_TIME,
    description: '',
    fullDescription: [
      'The drawing player picks a word that everyone will attempt to rhyme with.',
      'Moving clockwise, players take turns saying a word that rhymes with the original word.',
      'If a player cannot think of a word or repeats a word thats already been said, they are out.',
      'The last player standing wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: SiAudiomack,
    reward: 10,
    requirements: [],
  },
  {
    name: MiniGameType.QUARTER_SPIN,
    description: '',
    fullDescription: [
      'All players race to bounce a quarter into a shot glass.',
      'Last player to make it is out!',
      'Repeat until one player is left.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: GiTwister,
    requirements: ['coins'],
    reward: 10,
  },
  {
    name: MiniGameType.DICE_ROULETTE,
    description: '',
    fullDescription: [
      'Each player chooses a number between 1 and 6. This is your number for the whole game.',
      'You may choose the same number as another player.',
      "Starting with the drawing player and moving clockwise, roll a single die. If the number rolled is a player's number, they are out!",
      'The last player standing wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: GiChaingun,
    requirements: ['dice'],
    reward: 10,
  },
  {
    name: MiniGameType.COIN_DARTS,
    description: '',
    fullDescription: [],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: LuCircleDashed,
    requirements: ['coins'],
    reward: 10,
  },
  //   {
  //     name: MiniGameType.ONE_IN_THE_CHAMBER,
  //     description: '',
  //     fullDescription: [
  //       'Each player puts one shot glass in front of them.',
  //       'The drawing player gets one attempt to bounce a quarter into a shot glass of any other player.',
  //       "If the attacking player makes it, the defending player gets one chance at a rebuttle by bouncing a quarter into the attacking player's glass.",
  //       "If the rebuttle fails, the defending player's shot glass is removed from the game and they are out. The attacking player gets to go again.",
  //       'If the attacking player misses, the defending player is now the attacker and may go after any remaining player.',
  //       'Last player with a shot glass wins',
  //     ],
  //     type: DeckType.MINI_GAME_ALL_VS_ALL,
  //     icon: GiSilverBullet,
  //     requirements: ['coins', 'shot-glass'],
  //     reward: 10,
  //   },
  {
    name: MiniGameType.A_COIN_IN_THE_HAND,
    description: '',
    fullDescription: [
      'Players decide to hold a coin in their hand or not. (do not show other players)',
      'On your turn, proclaim to the group if you are holding a coin or if your hand is empty. (you may lie)',
      'Other players must come to a consensus on whether you are telling the truth or not.',
      'If they guess correctly, they win a point.',
      'If they guess incorrectly, you win a point.',
      'Repeat until each player has had a turn.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: PiHandCoins,
    requirements: ['coins'],
    reward: 10,
  },
  {
    name: MiniGameType.LOSING_COUNT,
    description: '',
    fullDescription: [
      'Moving clockwisem, players work together to count to 10, taking turns saying the next number in line. (ex: player 1 says "1", player 2 says "2", etc.)',
      'The player who the final number lands on get to replace an existing number with a rule.',
      'ex: the player who says the last number replaces the number 2 with a rule that states you must say the number 2 in a different language.',
      'After the rule is established, the player to the left of the last player starts the count over at 1.',
      'Repeat until the group has replaced all numbers with custom rules.',
      'If a player messes up the count, they are out.',
      'Last player standing wins! If multiple players make it to the end, they each win a point.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: GoNumber,
    requirements: [],
    reward: 10,
  },
  {
    name: MiniGameType.NINJA,
    description: '',
    fullDescription: [
      'Play a game of ninja!',
      'On the count of three, each player takes a ninja pose.',
      "Starting with the drawing player, take turns trying to hit another player's hand. Play moves clockwise.",
      'If your hand is hit, you are out!',
      'The last player standing wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: GiNinjaHead,
    requirements: ['standing'],
    reward: 10,
  },
  {
    name: MiniGameType.CLOCK_STOPERS,
    description: '',
    fullDescription: [
      'Roll the movement die twice to determine the time.',
      'Players take turns trying to stop a stopwatch as close to the time rolled as possible.',
      'The player who stops the stopwatch closest to the time rolled without going over wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: CgStopwatch,
    requirements: ['stop-watch'],
    reward: 10,
  },
  {
    name: MiniGameType.HORSE_RACE,
    description: '',
    fullDescription: [
      'Place coin tokens on this card at the starting line.',
      'Each player picks a number between 1 and 6.',
      'The drawing player rolls a single die.',
      'If the number rolled matches horse number, move that horse forward one space.',
      'The first horse to cross the finish line wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaHorse,
    requirements: ['dice'],
    reward: 10,
  },
]

export const MiniGamesOneVSAll: MiniGameCard[] = [
  {
    name: MiniGameType.BOSS_BATTLE,
    description: '',
    fullDescription: [
      'Role-playing time!',
      'The drawing player is the boss and the other players are the adventurers.',
      "The boss rolls as many dice as there are other players. The sum of the rolls represents the boss's health.",
      "Each adventurer gets a single dice roll. The sum of all of the adventurers' rolls is their attack",
      "If the adventurers' attack is greater than the boss's health, the adventurers win!",
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaDungeon,
    requirements: ['dice'],
    reward: 10,
  },
  {
    name: MiniGameType.HIDE_AND_SEEK,
    description: '',
    fullDescription: [
      'On three, everyone holds up a number of fingers between 1 and 5.',
      'If the drawing player holds up the same number of fingers as another player, they are out!',
      'On the next round, hold a number between 1 and 4.',
      'On the final round, hold a number between 1 and 3.',
      'The last player standing wins!',
      'Opposing players are not allowed to hint at their number.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: GiHidden,
    requirements: ['dice'],
    reward: 10,
  },
]

export const MiniGamesTeams: MiniGameCard[] = [
  {
    name: MiniGameType.MIND_MELD,
    description: 'Say the same word at the same time',
    fullDescription: [
      'The goal is to say the same word at the same time.',
      'On the count of three, the drawing player and the player to their left say whatever one word comes to mind.',
      'Rotate one player clockwise and repeat until two players say the same word.',
      'You cannot repeat a word that has already been said.',
      'Hint: try to find a connecting word between the two words previously said.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: LuBrain,
    reward: 10,
    requirements: [],
  },
]

export const MiniGamesDuel: MiniGameCard[] = [
  {
    name: MiniGameType.ROCK_PAPER_SCISSORS,
    description: '',
    fullDescription: [
      'Players face off in a rock paper scissors tournament,',
      'If even players, pair off and play. Winner of each pair plays each other.',
      'If odd players, one player sits out each round. Winner of each round plays the player who sat out.',
      '"Rock, Paper, Scissors, Shoot!"',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaHandScissors,
    requirements: [],
    reward: 10,
  },
  {
    name: MiniGameType.WHAT_ARE_YOU_DOING,
    description: '',
    fullDescription: [
      'The drawing player picks a short movement or action (ex: brushing teeth).',
      'The other player must act out the movement or action but must come up with a different answer than the drawing player.',
      'The first player to repeat an answer or not come up with an answer loses.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: MdQuestionAnswer,
    requirements: [],
    reward: 10,
  },
  {
    name: MiniGameType.CLOCK_STOPERS,
    description: '',
    fullDescription: [
      'Roll the movement die three times to determine the time.',
      'Players take turns trying to stop a stopwatch as close to the time rolled as possible.',
      'The player who stops the stopwatch closest to the time rolled without going over wins!',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: CgStopwatch,
    requirements: ['stop-watch'],
    reward: 10,
  },
  {
    name: MiniGameType.HOT_POTATO,
    description: '',
    fullDescription: [
      'Start a timer for 60 seconds and hide the timer.',
      'Pass a player token around the group clockwise.',
      'If the timer goes off while you are holding the coin, you lose.',
    ],
    type: DeckType.MINI_GAME_ALL_VS_ALL,
    icon: FaBomb,
    reward: 10,
    requirements: ['coins'],
  },
]

// TODO: add ability to have multiple of same card in deck
export const ItemCards: ItemCard[] = [
  {
    name: 'Double Dice',
    description: 'Roll two dice blocks',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: CgDice2,
  },
  {
    name: 'Triple Dice',
    description: 'Roll three dice blocks',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 10,
    icon: CgDice3,
  },
  {
    name: 'Boo Bell',
    description: 'Call boo and trigger the boo event',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 15,
    icon: CgBell,
  },
  {
    name: 'Magic Lamp',
    description: 'Warp to the space before the star',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 20,
    icon: GiMagicLamp,
  },
  {
    name: 'Cellular Shopper',
    description: 'Buy an item from the shop without visiting',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: PiPhone,
  },
  {
    name: 'Warp Pipe',
    description: 'Roll the player die and swap places with that player',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: MdPlumbing,
  },
  {
    name: 'Plunder Chest',
    description: 'Steal an item from a player of your choice',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: GiOpenTreasureChest,
  },
  {
    name: 'Boo Repellent',
    description: 'Boo will not steal coins or stars from you',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: GiGhost,
  },
  {
    name: 'Bowser Phone',
    description: 'Choose a player to draw a Bowser card',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 10,
    icon: GiDevilMask,
  },
  {
    name: 'Dueling Glove',
    description: 'Choose a player to duel with',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 15,
    icon: GiGloves,
  },
  //   {
  //     name: 'Skeleton Key',
  //     description: 'Roll two dice blocks',
  //     image: '/images/double-dice.png',
  //     type: DeckType.ITEM,
  //     shopCost: 5,
  //     icon: CgKey,
  //   },
  {
    name: 'Reverse Mushroom',
    description:
      'Roll a single die and move backwards that many spaces (can play on self or others)',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: GiSlicedMushroom,
  },
  {
    name: 'Poison Mushroom',
    description:
      'Can only roll 1 - 3 on your next turn (can play on self or others)',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: GiPoison,
  },
  {
    name: 'Chomp Call',
    description: 'Move the star to a new location',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 10,
    icon: FaDog,
  },
  {
    name: 'Hidden Block',
    description:
      'Roll a single die. If you roll a 6 you get a star, otherwise you gain 10 coins',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 10,
    icon: MdQuestionMark,
  },
  {
    name: 'Golden Pipe',
    description: 'Swap places with a player of your choice',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 15,
    icon: FaStar,
  },
  {
    name: 'Mushroom',
    description: '+5 to your dice roll',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 5,
    icon: GiMushroom,
  },
  {
    name: 'Golden Mushroom',
    description: '+10 to your dice roll',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 10,
    icon: GiSuperMushroom,
  },
  {
    name: 'Item Bag',
    description: 'Draw enough cards to fill your item slots',
    image: '/images/double-dice.png',
    type: DeckType.ITEM,
    shopCost: 25,
    icon: TbMoneybag,
  },
]

export const BowserCards: Card[] = [
  {
    name: 'The Great Equalizer',
    description:
      "Roll the player die and set everyone's coin value to the same amount as the player rolled",
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '10 coins for Bowser',
    description: 'Give Bowser 10 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '15 coins for Bowser',
    description: 'Give Bowser 15 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '20 coins for Bowser',
    description: 'Give Bowser 20 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '30 coins for Bowser',
    description: 'Give Bowser 30 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '10 coins from everyone',
    description: 'Everyone loses 10 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: 'Bowser Shuffle',
    description: 'Everyone swaps positions with the player to their right',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: 'Bowser Suit',
    description:
      'Roll the movement die twice. If you pass another player, steal 10 coins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: "Bowser's Chance Time",
    description: 'Trigger a chance time event with Bowser. Bowser always wins',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
  {
    name: '100 Star Present',
    description: 'Bowser ran away. You get nothing.',
    image: '/images/bowser.png',
    type: DeckType.BOWSER,
  },
]

export const MiniGameAllVSAllDeck: CardDeck = {
  cards: MiniGamesAllVSALL,
  type: DeckType.MINI_GAME_ALL_VS_ALL,
  color: 'blue',
}

export const MiniGameOneVSAllDeck: CardDeck = {
  cards: MiniGamesOneVSAll,
  type: DeckType.MINI_GAME_1_VS_ALL,
  color: 'blue',
}

export const MiniGameTeamDeck: CardDeck = {
  cards: MiniGamesTeams,
  type: DeckType.MINI_GAME_TEAMS,
  color: 'blue',
}

export const DuelDeck: CardDeck = {
  cards: MiniGamesDuel,
  type: DeckType.DUEL,
  color: 'purple',
}

export const ItemDeck: CardDeck = {
  cards: ItemCards,
  type: DeckType.ITEM,
  color: 'green',
  config: {
    'Double Dice': 3,
    'Triple Dice': 2,
    Mushroom: 3,
    'Golden Mushroom': 1,
    'Boo Bell': 1,
    'Magic Lamp': 1,
    'Cellular Shopper': 1,
    'Warp Pipe ': 2,
    'Plunder Chest': 1,
    'Boo Repellent': 2,
    'Bowser Phone': 1,
    'Dueling Glove': 1,
    // 'Skeleton Key': 2,
    'Reverse Mushroom': 1,
    'Poison Mushroom': 1,
    'Chomp Call': 1,
    'Hidden Block': 2,
    'Golden Pipe': 1,
  },
}

export const BowserDeck: CardDeck = {
  cards: BowserCards,
  type: DeckType.BOWSER,
  color: 'red',
  config: {
    'The Great Equalizer': 1,
    '10 coins for Bowser': 3,
    '15 coins for Bowser': 3,
    '20 coins for Bowser': 2,
    '30 coins for Bowser': 1,
    '10 coins from everyone': 1,
    'Bowser Shuffle': 1,
    'Bowser Suit': 1,
    "Bowser's Chance Time": 2,
    '100 Star Present': 1,
  },
}
