import {
  GiAngelOutfit,
  GiBattleAxe,
  GiBreakingChain,
  GiCoins,
  GiDeerTrack,
  GiNinjaHead,
  GiPerspectiveDiceThree,
  GiPig,
  GiPouringChalice,
  GiRopeBridge,
} from 'react-icons/gi'
import { GiClown } from 'react-icons/gi'
import { MdContentCopy } from 'react-icons/md'
import { MdLocalMovies } from 'react-icons/md'
import { GiCardJackClubs } from 'react-icons/gi'
import { GiGlassShot } from 'react-icons/gi'
import {
  FaBookDead,
  FaBoxOpen,
  FaBusAlt,
  FaCoins,
  FaCrown,
  FaDice,
  FaDungeon,
  FaEye,
  FaFireAlt,
  FaGlassCheers,
  FaHandHoldingHeart,
  FaHashtag,
  FaHorse,
  FaMask,
  FaPaintBrush,
  FaPencilAlt,
  FaPhone,
  FaRunning,
  FaSkull,
  FaStopwatch,
} from 'react-icons/fa'
import { TbCircleLetterW } from 'react-icons/tb'
import {
  PiDetectiveBold,
  PiDiceSixBold,
  PiNumberCircleThreeBold,
} from 'react-icons/pi'
import { PiHandCoins } from 'react-icons/pi'
import { GoNumber } from 'react-icons/go'
import {
  FaArrowsSpin,
  FaExplosion,
  FaFlagCheckered,
  FaGolfBallTee,
  FaHandScissors,
  FaHouse,
  FaLayerGroup,
  FaSpaghettiMonsterFlying,
} from 'react-icons/fa6'
import { CgCardSpades } from 'react-icons/cg'
import { LuBrain, LuSprout } from 'react-icons/lu'
import { FaHand } from 'react-icons/fa6'
import { SiAudiomack } from 'react-icons/si'
import { GiTwister } from 'react-icons/gi'
import { GiChaingun } from 'react-icons/gi'
import { GiSilverBullet } from 'react-icons/gi'
import { ElementType } from 'react'
import { Card } from '../types/types'
import { IoBeer } from 'react-icons/io5'
import { CiCoinInsert } from 'react-icons/ci'

export enum MiniGameType {
  MIND_MELD = 'Mind Meld',
  NEVER_HAVE_I_EVER = 'Never Have I Ever',
  ROCK_PAPER_SCISSORS = 'Rock Paper Scissors',
  HOUSE_OF_CARDS = 'House of Cards',
  CATEGORIES = 'Categories',
  RHYME_TIME = 'Rhyme Time',
  QUARTER_SPIN = 'Tornado Alley',
  BLACK_JACK = 'Black Jack',
  MINI_GOLF = 'Mini Golf',
  QUARTER_RACE = 'Quarter Race',
  DICE_ROULETTE = 'Dice Roulette',
  QUARTER_ATTACK = 'Quarter Attack',
  IM_THE_JOKER_BABY = "I'm the Joker, Baby",
  THE_PERFECT_MATCH = 'The Perfect Match',
  TIPPY_SHOT = 'Tippy-Shot',
  YOU_CAN_QUOTE_ME = 'You Can Quote Me!',
  SLAP_JACK = 'Slap-Jack',
  PENNIES = 'Left, Right, Center (Pennies)',
  SMOKE_OR_FIRE = 'Smoke or Fire',
  WHAT_AM_I = 'Who Am I?',
  ONE_IN_THE_CHAMBER = 'One in the Chamber',
  A_COIN_IN_THE_HAND = 'A Coin in the Hand',
  LOSING_COUNT = 'Losing Count',
  NINJA = 'Ninja',
  MOOSE = 'Moose',
  SOCIAL = 'Social',
  ROLL_CALL = 'Roll Call',
  ITS_A_DATE = "It's a Date",
  IMPOSTER = 'Imposter Syndrome',
  I_CAN_COUNT_TO_SIX = 'Ducks in a Row',
  TELESKETCH = 'Lost in Translation',
  HANG_MAN = 'Hangman',
  THAT_WORD_GAME = 'That Word Game',
  LAND_MINES = 'Land Mines',
  STORY_TIME = 'Story by Committee',
  PIG = 'Pig',
  RULE = 'Rule',
  HEAVEN = 'Heaven',
  DOTS_AND_BOXES = 'Dots and Boxes',
  BOSS_BATTLE = 'Boss Battle',
  MONSTER_CLOSET = 'Monster Closet',
  FIRST_TO_THREE = 'Grandma!',
  SPROUT = 'Sprout',
  TREAT_YO_SELF = 'Treat Yo Self',
  POUR_ONE_FOR_A_HOMIE = 'Pour One for a Homie',
  HASHCRONYMS = 'Hash-cronyms',
  SHOT_FOR_SHOT = 'Shot for Shot',
  FAKE_IT_TILL = "Fake it 'Till You Make it",
  LOOKS = 'If Looks Could Kill',
  RIDE_THE_BUS = 'Ride the Bus',
  CONNECTIONS = 'Connections',
  COIN_HOLE = 'Coin Hole',
  BRIDGE = 'Suspension Bridge',
  HORSE = 'A Day at the Races',
}

export type MiniGameRequirements =
  | 'none'
  | 'cards'
  | 'coins'
  | 'dice'
  | 'shot-glass'
  | 'standing'
  | 'drawing'
  | 'drinking'
  | 'stop-watch'

export interface MiniGame {
  description: string[]
  title: MiniGameType
  reward?: string
  icon: ElementType
  requirements?: MiniGameRequirements[]
  minPlayers?: number
  isBeta?: boolean
}

export const getMiniGameByTitle = (title: MiniGameType) => {
  return partyCards.find((card) => card.title === title)
}

export const getPartyCardDeck = (): Card[] => {
  return partyCards.map((card, index) => {
    return {
      id: index,
      name: card.title,
      type: 'non-standard',
      status: 'none',
    }
  })
}

export const getPartyCardDeckWithConfig = (config: {
  [key in MiniGameType]?: boolean
}): Card[] => {
  return partyCards.reduce((acc, card) => {
    if (config[card.title]) {
      acc.push({
        id: acc.length,
        name: card.title,
        type: 'non-standard',
        status: 'none',
      })
    }

    return acc
  }, [] as Card[])
}

export const getRequirementIcon = (requirement: MiniGameRequirements) => {
  switch (requirement) {
    case 'dice':
      return FaDice
    case 'cards':
      return CgCardSpades
    case 'coins':
      return FaCoins
    case 'shot-glass':
      return GiGlassShot
    case 'standing':
      return FaRunning
    case 'drinking':
      return IoBeer
    case 'drawing':
      return FaPencilAlt
    case 'stop-watch':
      return FaStopwatch
    default:
      return null
  }
}

export const partyCards: MiniGame[] = [
  {
    title: MiniGameType.MIND_MELD,
    description: [
      'The goal is to say the same word at the same time.',
      'On the count of three, the drawing player and the player to their left say whatever one word comes to mind.',
      'Rotate one player clockwise and repeat until two players say the same word.',
      'You cannot repeat a word that has already been said.',
      'Hint: try to find a connecting word between the two words previously said.',
    ],
    reward: '1 point each',
    icon: LuBrain,
  },
  {
    title: MiniGameType.NEVER_HAVE_I_EVER,
    description: [
      'Each player starts with 3 fingers up.',
      'Takes turns saying something you have never done.',
      'If another player has done that thing, they put a finger down.',
      'If no one has done that thing, the player who said it puts a finger down.',
      'The first player to put all fingers down loses and the game ends.',
    ],
    reward: '1 point per finger up',
    icon: FaHand,
  },
  {
    title: MiniGameType.ROCK_PAPER_SCISSORS,
    description: [
      'Players face off in a rock paper scissors tournament,',
      'If even players, pair off and play. Winner of each pair plays each other.',
      'If odd players, one player sits out each round. Winner of each round plays the player who sat out.',
      '"Rock, Paper, Scissors, Shoot!"',
    ],

    reward: '1 point',
    icon: FaHandScissors,
  },
  {
    description: [
      'Race to build a house of cards using 5 cards.',
      'First player to build a house without it falling over wins.',
    ],
    title: MiniGameType.HOUSE_OF_CARDS,
    reward: '1 point',
    icon: FaHouse,
    requirements: ['cards'],
  },
  {
    description: [
      'The drawing player picks a category (ex: breakfast cereal) and names one thing in that category.',
      'Moving clockwise, players take turns naming an item in the cateogry.',
      'If a you cannot name something or repeat an item thats already been said, you are out.',
      'The last player standing wins!',
    ],
    title: MiniGameType.CATEGORIES,
    reward: '1 point',
    icon: FaLayerGroup,
  },
  {
    title: MiniGameType.RHYME_TIME,
    description: [
      'The drawing player picks a word that everyone will attempt to rhyme with.',
      'Moving clockwise, players take turns saying a word that rhymes with the original word.',
      'If a player cannot think of a word or repeats a word thats already been said, they are out.',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: SiAudiomack,
  },
  {
    title: MiniGameType.QUARTER_SPIN,
    description: [
      'All players spin a quarter at the same time.',
      'The last quarter to fall wins!',
    ],
    reward: '1 point',
    icon: GiTwister,
    requirements: ['coins'],
  },
  {
    title: MiniGameType.BLACK_JACK,
    description: [
      'The drawing player deals two cards to each player, face up.',
      'Moving clockwise, players can choose to hit (draw an additional card) or stay.',
      'Players can hit as many times as they want, but if they go over 21, they are out.',
      'The player with the highest hand without going over 21 wins!',
      'If there is a tie, all players with the highest hand win.',
    ],
    reward: '1 point',
    icon: CgCardSpades,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.MINI_GOLF,
    description: [
      'Players are dealt four cards face down.',
      'At the beginning of the game, players can peek at two of their cards.',
      'Take turns drawing a card from the deck or the discard pile.',
      'If you draw from the deck, you can choose to keep the card or discard it. If you keep it, you must discard one of your face down cards. If you discard it, you must turn over one of your face down cards.',
      'If you draw from the discard pile, you must discard one of your face down cards.',
      'Point values:',
      '- pairs of two: 0',
      '- 2 - 10, jack, queen: face value',
      '- king: 0',
      '- ace: 1',
      '- joker: wild',
      'Once all player cards are face up, the player with the lowest score wins!',
    ],
    reward: '1 point',
    icon: FaGolfBallTee,
    requirements: ['cards'],
    isBeta: true,
  },
  {
    title: MiniGameType.QUARTER_RACE,
    description: [
      'All players race to bounce a quarter into a shot glass.',
      'Last player to make it is out!',
      'Repeat until one player is left.',
    ],
    reward: '1 point',
    icon: FaFlagCheckered,
    requirements: ['coins', 'shot-glass'],
  },
  {
    title: MiniGameType.DICE_ROULETTE,
    description: [
      'Each player chooses a number between 1 and 6. This is your number for the whole game.',
      'You may choose the same number as another player.',
      "Starting with the drawing player and moving clockwise, roll a single die. If the number rolled is a player's number, they are out!",
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: GiChaingun,
    requirements: ['dice'],
  },
  {
    title: MiniGameType.QUARTER_ATTACK,
    description: [
      'Two players on opposite sides of the table race to bounce a quarter into a shot glass.',
      'If you have a quarter and a shot glass in front of you, you must bounce the quarter into the shot glass before you can pass it.',
      'If the person to your immediate right also has a quarter and a shot glass in front of them, you must make your shot before they do.',
      'If the person to your right makes their shot before you, you are out!',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: GiBattleAxe,
    requirements: ['coins', 'shot-glass'],
  },
  {
    title: MiniGameType.IM_THE_JOKER_BABY,
    description: [
      'Including exactly one joker card, lay down as many cards as there are players, face down.',
      'Players take turns flipping one card over.',
      'If you flip a joker, you are out!',
      'When a player goes out, remove a non-joker card and reshuffle. The player to the left of the player who went out starts the next round.',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: GiClown,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.THE_PERFECT_MATCH,
    description: [
      'The drawing player shuffles and lays 8 card pairs face down on the table.',
      'Starting with the drawing player and moving clockwise, players take turns flipping two cards.',
      'If you flip a pair, you get to keep the pair, and you get to go again.',
      "If you don't flip a pair, flip the cards back over.",
      'The player with the most pairs wins!',
    ],
    reward: '1 point',
    icon: MdContentCopy,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.TIPPY_SHOT,
    description: [
      'Place a shot glass right-side up on the edge of the table.',
      'At the same time, players race to flip the shot glass so it lands upside down on the table.',
      'Last player to flip the shot glass is out!',
      'Repeat until one player is left.',
      'Word of advice: only play with plastic shot glasses...',
    ],
    reward: '1 point',
    icon: GiGlassShot,
    requirements: ['shot-glass'],
  },
  {
    title: MiniGameType.YOU_CAN_QUOTE_ME,
    description: [
      'Starting with the drawing player and moving clockwise, players take turns quoting a line from any movie.',
      'First player to guess the movie correctly wins a point.',
      'If no one guesses correctly, the player who quoted loses a point.',
      'Continue until each player has given one movie quote.',
    ],
    reward: '1 point per win',
    icon: MdLocalMovies,
  },
  {
    title: MiniGameType.SLAP_JACK,
    description: [
      'Players take turns flipping a card over from the deck.',
      'If a Jack is flipped, the first player to slap the card wins!',
      'If a player slaps a card that is not a Jack, they are out.',
    ],
    reward: '1 point',
    icon: GiCardJackClubs,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.PENNIES,
    description: [
      'Players start with one quarter each.',
      'Take turns rolling a single die. The number you roll determines what happens to your quarter.',
      '1 - 3: nothing happens',
      '4 - add quarter to pot',
      '5 - pass quarter to left',
      '6 - pass quarter to right',
      'If you you do not have a quarter, you do not roll. However, you can still win quarters from other players.',
      'Last player with a quarter wins',
    ],
    reward: '1 point per quarter',
    icon: GiCoins,
    requirements: ['coins', 'dice'],
  },
  {
    title: MiniGameType.SMOKE_OR_FIRE,
    description: [
      'Play a game of Smoke or Fire.',
      'Players take turns guessing the card on top of the deck. After each guess, the card is flipped over and given to the guessing player.',
      'Round 1: Guess if the card is black (smoke) or red (fire).',
      'Round 2: Guess if the card is higher or lower than your previous card.',
      'Round 3: Guess if the card is inside or outside of your previous two cards.',
      'Round 4: Guess the suite of the card.',
      'If you draw a joker, redraw.',
      'For each round you guess correctly, you get a point.',
    ],
    reward: '1 point per round',
    icon: FaFireAlt,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.WHAT_AM_I,
    description: [
      'Each player draws a card and places it on their forehead, face out.',
      'Moving clockwise, take turns guessing the card on your forehead.',
      'If you guess incorrectly, the other players tell you if your card is higher or lower.',
      'If you guess correctly, you are safe and may put your card down.',
      'Constraints:',
      '- One guess per turn.',
      '- Aces are low. (1)',
      '- Jokers are high. (14)',
      'Last player to guess their card loses.',
    ],
    reward: '1 point each',
    icon: PiDetectiveBold,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.ONE_IN_THE_CHAMBER,
    description: [
      'Each player puts one shot glass in front of them.',
      'The drawing player gets one attempt to bounce a quarter into a shot glass of any other player.',
      "If the attacking player makes it, the defending player gets one chance at a rebuttle by bouncing a quarter into the attacking player's glass.",
      "If the rebuttle fails, the defending player's shot glass is removed from the game and they are out. The attacking player gets to go again.",
      'If the attacking player misses, the defending player is now the attacker and may go after any remaining player.',
      'Last player with a shot glass wins',
    ],
    reward: '10 coins',
    icon: GiSilverBullet,
    requirements: ['coins', 'shot-glass'],
  },
  {
    title: MiniGameType.A_COIN_IN_THE_HAND,
    description: [
      'Players decide to hold a coin in their hand or not. (do not show other players)',
      'On your turn, proclaim to the group if you are holding a coin or if your hand is empty. (you may lie)',
      'Other players must come to a consensus on whether you are telling the truth or not.',
      'If they guess correctly, they win a point.',
      'If they guess incorrectly, you win a point.',
      'Repeat until each player has had a turn.',
    ],
    reward: '1 point',
    icon: PiHandCoins,
    requirements: ['coins'],
  },
  {
    title: MiniGameType.LOSING_COUNT,
    description: [
      'Moving clockwisem, players work together to count to 10, taking turns saying the next number in line. (ex: player 1 says "1", player 2 says "2", etc.)',
      'The player who the final number lands on get to replace an existing number with a rule.',
      'ex: the player who says the last number replaces the number 2 with a rule that states you must say the number 2 in a different language.',
      'After the rule is established, the player to the left of the last player starts the count over at 1.',
      'Repeat until the group has replaced all numbers with custom rules.',
      'If a player messes up the count, they are out.',
      'Last player standing wins! If multiple players make it to the end, they each win a point.',
    ],
    reward: '1 point',
    icon: GoNumber,
  },
  {
    title: MiniGameType.NINJA,
    description: [
      'Play a game of ninja!',
      'On the count of three, each player takes a ninja pose.',
      "Starting with the drawing player, take turns trying to hit another player's hand. Play moves clockwise.",
      'If your hand is hit, you are out!',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: GiNinjaHead,
    requirements: ['standing'],
  },
  {
    title: MiniGameType.MOOSE,
    description: [
      'You are now the Moose!',
      'Once per round, you can place your hands on your head like antlers.',
      'The last player to show their antlers takes a drink.',
    ],
    reward: '1 drink',
    icon: GiDeerTrack,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.SOCIAL,
    description: ['Cheers! Everyone takes a drink!'],
    reward: '1 drink',
    icon: FaGlassCheers,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.HEAVEN,
    description: [
      'You are now the angel!',
      'Once per round, you can point to the sky.',
      'The last player to point to the sky takes a drink.',
    ],
    reward: '1 drink',
    icon: GiAngelOutfit,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.ROLL_CALL,
    description: [
      'Everyone rolls a single die to determine how many drinks they take.',
    ],
    reward: 'Drink dice value',
    icon: GiPerspectiveDiceThree,
    requirements: ['drinking', 'dice'],
  },
  {
    title: MiniGameType.ITS_A_DATE,
    description: ['Choose one person to take a drink with you. Cheers!'],
    reward: '1 drink each',
    icon: FaHandHoldingHeart,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.RULE,
    description: [
      'You get to make up any rule you want!',
      'ex: no pointing, no saying names, no swearing, etc.',
    ],
    reward: '1 drink each',
    icon: FaCrown,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.TREAT_YO_SELF,
    description: ['You deserve it! Take a drink! (or two, or three...)'],
    reward: '1 drink',
    icon: IoBeer,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.IMPOSTER,
    description: [
      'Including exactly one joker card, deal a card to each player. The player with the joker is the imposter.',
      'The goal is to figure out who the imposter is.',
      'At the start of the round, each player can state their case for why they are not the imposter. At the end of deliberation, everyone votes for who they think the imposter is. The player with the most votes is reveals their card.',
      'If the voted out player is not the imposter, they are out and a new round begins.',
      'If the imposter is not out by the time there are only two players left, the imposter wins!',
      'If the imposter is found, each member of the crew wins a point!',
    ],
    reward: '1 point',
    icon: FaMask,
    requirements: ['cards'],
    minPlayers: 4,
  },
  {
    title: MiniGameType.I_CAN_COUNT_TO_SIX,
    description: [
      'Takes turns rolling a two die.',
      'The goal is to roll 1 - 6 in order.',
      'Start by trying to roll a 1, then a 2, then a 3, etc.',
      'Do not move on to the next number until you roll the current number you are on.',
      'If at least one of the dice is the number you are on, you may roll again.',
      'If you roll your current number and the next number, both numbers count.',
      'If you do not roll your current number, your turn is over.',
      'Whoever gets to 6 first wins!',
    ],
    reward: '1 point',
    icon: PiDiceSixBold,
    requirements: ['dice'],
  },
  {
    title: MiniGameType.TELESKETCH,
    description: [
      'The player who drew the card writes a phrase on a piece of paper. (Limit 3 words)',
      'They then secretly shows the phrase to the player to their left.',
      'That player must attempt to draw a picture based on the phrase they are shown.',
      'The player to their right attempts to write down the original phrase based on the previously drawn picture.',
      'If there are more than three players, continue the process until each player has had a turn.',
      'If there are an even number of players, the last two players must guess the original phrase together.',
      'For how many words are correct, each player gets a point',
    ],
    reward: '1 point/word',
    icon: FaPhone,
    requirements: ['drawing'],
  },
  {
    title: MiniGameType.HANG_MAN,
    description: [
      'The drawing player picks any word or phrase. (Limit 3 words). They then draw a blank _ for each letter in the word/phrase.',
      'Moving clockwise, players take turns guessing letters.',
      'If a player guesses a letter correctly, the player who picked the word/phrase writes the letter in the correct blank. The guessing player may attempt to guess the word/phrase. (one guess per turn)',
      'After 6 incorrect letter guesses, the player who picked the word/phrase wins.',
      'If the word/phrase is guessed correctly, the player who guessed it wins.',
    ],
    reward: '1 point',
    icon: FaSkull,
    requirements: ['drawing'],
  },
  {
    title: MiniGameType.THAT_WORD_GAME,
    description: [
      'The drawing player picks a 5 letter word and announces its letter count.',
      'Other players take turns guessing a word with the same letter count.',
      'If a letter is correct but in the wrong spot, the host puts an _ under the letter.',
      'If a letter is correct and in the right spot, the host puts a O under the letter.',
      'Repeat until 6 guesses are made.',
      'If the word is guessed correctly, the crew wins. If not, the host wins.',
    ],
    reward: '1 point',
    icon: TbCircleLetterW,
    requirements: ['drawing'],
    isBeta: true,
  },
  {
    title: MiniGameType.DOTS_AND_BOXES,
    description: [
      'Draw a 5 x 5 grid of dots.',
      'Take turns drawing a line between two dots.',
      'If you complete a 1x1 box, write your initial in that box and take another turn.',
      'Repeat until all boxes are filled in.',
      'The player with the most boxes wins.',
    ],
    reward: '1 point',
    icon: FaBoxOpen,
    requirements: ['drawing'],
  },
  {
    title: MiniGameType.LAND_MINES,
    description: [
      'Start by spinning a quarter on the table.',
      'Players take turns flicking the quarter to keep it spinning.',
      'If a player knocks over the quarter, they are out, but they get to place another quarter anywhere on the table as an obstacle.',
      'Last player standing wins!',
    ],
    reward: '1 point',
    icon: FaExplosion,
    requirements: ['coins'],
  },
  {
    title: MiniGameType.STORY_TIME,
    description: [
      'The drawing player starts an original story with a single word.',
      'Players take turns repeating the story from the begging, adding one new word at the end.',
      'If a player messes up the story, they are out.',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: FaBookDead,
  },
  {
    title: MiniGameType.PIG,
    description: [
      'Starting with the drawing player, take turns rolling a single die.',
      'If you roll a 2 - 6, you add that number to your score. You may then choose to roll again or lock in your score.',
      'If you roll a 1, you get 0 points and your turn is over.',
      'Highest score wins!',
    ],
    reward: '1 point',
    icon: GiPig,
    requirements: ['dice'],
  },
  {
    title: MiniGameType.BOSS_BATTLE,
    description: [
      'Role-playing time!',
      'The drawing player is the boss and the other players are the adventurers.',
      "The boss rolls as many dice as there are other players. The sum of the rolls represents the boss's health.",
      "Each adventurer gets a single dice roll. The sum of all of the adventurers' rolls is their attack",
      "If the adventurers' attack is greater than the boss's health, the adventurers win!",
    ],
    reward: '1 point',
    icon: FaDungeon,
    requirements: ['dice'],
  },
  {
    title: MiniGameType.MONSTER_CLOSET,
    description: [
      'There is a monster in the closet!',
      'A monster must have 1 body, 1 head, 2 legs, 2 arms, 2 eyes, and 1 mouth.',
      'Starting with the drawing player, take turns rolling a single die and drawing the corresponding body part.',
      '1 - body',
      '2 - head',
      '3 - legs',
      '4 - arms',
      '5 - eyes',
      '6 - mouth',
      'Constraints:',
      '- Legs, arms, and head cannot be drawn until body is drawn.',
      '- Eyes and mouth cannot be drawn until head is drawn.',
      'If you roll a number for a body part that has already been drawn, your turn is over.',
      'If you roll a number for a body part that has not been drawn, draw that body part and roll again.',
      'First player to draw a monster wins!',
    ],
    reward: '1 point',
    icon: FaSpaghettiMonsterFlying,
    requirements: ['dice', 'drawing'],
  },
  {
    title: MiniGameType.FIRST_TO_THREE,
    description: [
      'Threes and Jokers are wild!',
      'Deal 3 cards to each player.',
      'Take turns drawing a card from the deck or the discard pile.',
      'First player to get three of a kind or a straight flush yells \'Grandma!\'. Once "Grandma" is called, Everone else gets one more turn.',
      'All players with three of a kind or a straight flush win!',
    ],
    reward: '1 point each',
    icon: PiNumberCircleThreeBold,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.SPROUT,
    description: [
      'Draw 3 dots anywhere on a piece of paper.',
      'Take turns drawing a line between any two dots or from one dot back to itself.',
      'After drawing a line, place a new dot on the line you just drew.',
      'Constraints:',
      '- You cannot draw a line that crosses another line.',
      '- You cannot draw a line that goes through an existing dot.',
      '- No more than 3 lines can sprout from a single dot.',
      'If you cannot draw a line or draw a line that violates a constraint, you are out.',
      'Last player to draw a line wins!',
    ],
    reward: '1 point',
    icon: LuSprout,
    requirements: ['drawing'],
  },
  {
    title: MiniGameType.POUR_ONE_FOR_A_HOMIE,
    description: ['Give a drink to a player of your choice!'],
    reward: '1 drink',
    icon: GiPouringChalice,
    requirements: ['drinking'],
  },
  {
    title: MiniGameType.HASHCRONYMS,
    description: [
      'The drawing player comes up with a one sentence social media status about anything they want.',
      'The status must end with a hashtag using a made up acronym related to the status.',
      'ex: "This new jacket is tight, son! #RTSB"',
      'Players must try to figure out what the acronym stands for. ex: "Run That Shit Bitch!"',
      'First player to correctly guess the acronym wins a point!',
      'Repeat until each player has had a turn creating a fake status.',
    ],
    reward: '1 point',
    icon: FaHashtag,
  },
  {
    title: MiniGameType.SHOT_FOR_SHOT,
    description: [
      'Two players on opposite sides of the table place a shot glass right-side up on the edge of the table.',
      'The two players race to flip the shot glass so it lands upside down on the table.',
      'If you have a shot glass in front of you, you must successfully flip the shot glass before you can pass it.',
      'If the person to your immediate right also has a shot glass in front of them, you must land your glass before they do.',
      'If the person to your right lands their glass before you, you are out!',
      'The last player standing wins!',
    ],
    reward: '1 point',
    icon: FaArrowsSpin,
    requirements: ['shot-glass'],
    isBeta: true,
  },
  {
    title: MiniGameType.FAKE_IT_TILL,
    description: [
      'The goal is to find out who the fake artist is.',
      "The player who drew the card comes up with a picture that everyone will work together to draw. They then write down the picture's subject on as many pieces of paper as there are other players, but leaving one blank.",
      'All players, except for the dealer, draw a paper from a hat.',
      'Moving clockwise, players take turns drawing one shape or line at a time.',
      'If you are the fake artist, you do not know what the word is and must try to blend in.',
      'If you are not the fake artist, you must try to find out who the fake artist is.',
      'After each player has drawn twice, everyone votes on who they think the fake artist is.',
    ],
    reward: '1 point',
    icon: FaPaintBrush,
    requirements: ['drawing'],
  },
  {
    title: MiniGameType.LOOKS,
    description: [
      'Including exactly one joker card, deal a card to each player. The player with the joker is the assassin.',
      'The goal is to figure out who the assassin is.',
      'The assassin must wink at another player without being caught.',
      'If you are winked at, you are have been shot. Wait 5 seconds before dramatically dying at the table.',
      'If you think you know who the assassin is, you can call them out. If you are wrong, you are dead.',
      'Do not talk during the game unless you are calling out the assassin.',
      'If the assassin is not out by the time there are only two players left, the assassin wins!',
    ],
    reward: '1 point',
    icon: FaEye,
    requirements: ['cards'],
    isBeta: true,
  },
  {
    title: MiniGameType.RIDE_THE_BUS,
    description: [
      'The drawing player deals 9 cards to each player, face down.',
      'Players arrange their cards in a diamond shape. rows: 1 - 2 - 3 - 2 - 1',
      'Moving clockwise, players take turns flipping over a card from their first row.',
      'If the card is not a face card, the player moves on to the next row on thier next turn.',
      'If the card is a face card, the player replaces all of their flipped cards with new ones face down. The player then starts over at the first row on their next turn.',
      'Once a player successfully flips the card in the last row, everyone else gets one more turn.',
      'The players who make it to the last row win!',
    ],
    reward: '1 point',
    icon: FaBusAlt,
    requirements: ['cards'],
  },
  {
    title: MiniGameType.CONNECTIONS,
    description: [
      'Starting with the drawing player, take turns drawing a card from the deck and placing it face up in front of them.',
      'Moving clockwise, players take turns drawing a card from the deck and placing it face up in front of them.',
      'If the card you draw matches the suit or number of a card of the player to their left or right, a connection is made and all connecting players take a drink.',
      'Connections are not limited to 3 players. If a connected player connects with another player next to them, all players in the chain take a drink.',
      'Repeat for 5 rounds.',
    ],
    reward: '1 point',
    icon: GiBreakingChain,
    requirements: ['drinking', 'cards'],
  },
  {
    title: MiniGameType.COIN_HOLE,
    description: [
      '"Coin Hole" is a game of skill and precision.',
      'Place a shot glass in the center of the table. Each player places a card wherever they want near the shot glass.',
      'Starting with the drawing player and moving clockwise, players take turns trying to bounce a quarter into the shot glass.',
      'If you make it, you get 3 points and you get to go again.',
      'If you miss, but the quarter lands on a card, you get 1 point and get to go again. (quarter does not need to be fully on the card)',
      'First player to 11 points wins!',
    ],
    reward: '1 point',
    icon: CiCoinInsert,
    requirements: ['coins', 'cards', 'shot-glass'],
    isBeta: true,
  },
  {
    title: MiniGameType.BRIDGE,
    description: [
      'Place two shot glasses right-side-up on the table, right next to eachother.',
      'Place a card on top of the two shot glasses, creating a bridge.',
      'Starting with the drawing player and moving clockwise, players take turns trying to bounce a quarter onto the bridge.',
      'If you land the quarter on the bridge or into a shot glass, the final round begins.',
      'In the final round, all other players get one attempt to bounce a quarter onto the bridge or into a shot glass.',
      'All players with a quarter on the bridge or in a shot glass wins a point!',
      'If the original quarter gets knocked off the bridge and there are no quarters in the shot glasses, the first person to make it onto the bridge or into a shot glass wins!',
    ],
    reward: '1 point',
    icon: GiRopeBridge,
    requirements: ['coins', 'cards', 'shot-glass'],
    isBeta: true,
  },
  {
    title: MiniGameType.HORSE,
    description: [
      'Get your horses ready!',
      'On a piece of paper, each player writes down their horses name, separated by horizontal lines.',
      "Players take turns rolling a two dice to determine their horses speed. Write the speed next to the player's horse.",
      "Write down the corresponding number of blanks next to the player's horse.",
      'Blanks per number:',
      '2 or 12: 2 blanks',
      '3 or 11: 3 blanks',
      '4 or 10: 4 blanks',
      '5 or 9: 5 blanks',
      '6 or 8: 6 blanks',
      '7: 7 blanks',
      'Starting with the drawing player and moving clockwise, players take turns rolling two dice.',
      'If it lands on a horses speed, fill in a blank for each horse with that speed and roll again.',
      "If it lands on a different number, the player's turn is over.",
      'First horse to have all blanks filled in wins!',
    ],
    reward: '1 point',
    icon: FaHorse,
    requirements: ['coins', 'cards', 'drawing'],
  },
]
