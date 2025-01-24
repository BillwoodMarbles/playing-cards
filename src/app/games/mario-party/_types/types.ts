import { MiniGameRequirements } from '@/data/party-cards'
import { IconType } from 'react-icons'

export enum DeckType {
  MINI_GAME_ALL_VS_ALL = 'mini-game-all-vs-all',
  MINI_GAME_1_VS_ALL = 'mini-game-1-vs-all',
  MINI_GAME_TEAMS = 'mini-game-teams',
  BOWSER = 'bowser',
  ITEM = 'item',
  DUEL = 'duel',
}

export enum Characters {
  MARIO = 'Mario',
  LUIGI = 'Luigi',
  PEACH = 'Peach',
  YOSHI = 'Yoshi',
  WARIO = 'Wario',
  WALUIGI = 'Waluigi',
}

export interface CardDeck {
  cards: Card[]
  type: DeckType
  color: string
  config?: Record<string, number>
}

export interface Card {
  name: string
  description?: string
  fullDescription?: string[]
  image?: string
  type: DeckType
  icon?: IconType
  shopCost?: number
  requirements?: MiniGameRequirements[]
}

export interface MiniGameCard extends Card {
  reward: number
  requirements: MiniGameRequirements[]
}

export interface ItemCard extends Card {
  shopCost: number
}

export interface MarioPartyPlayer {
  id: string
  character: Characters
  color: string
  coins: number
  stars: number
  items: ItemCard[]
}

export enum ActionId {
  RED = 'red',
  BLUE = 'blue',
  CHANCE = 'chance',
  EVENT = 'event',
  ITEM = 'item',
  BANK = 'bank',
  SHOP = 'shop',
  BOO = 'boo',
  STAR = 'star',
  BOWSER = 'bowser',
  LUCKY = 'lucky',
  VS = 'vs',
}

export enum ActionColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  BLACK = 'black',
}

export enum ActionSpaceType {
  SPACE = 'space',
  PASS = 'pass',
}

export interface Action {
  id: ActionId
  name: string
  icon?: IconType
  color?: ActionColor
  type: ActionSpaceType
  description?: string
  component?: React.ComponentType
}

export enum DieType {
  MOVEMENT = 'movement',
  PLAYER = 'player',
  CHANCE = 'chance',
}

export interface Die {
  name: string
  values: string[] | number[]
  type: DieType
  color: string
  icon: IconType
}
