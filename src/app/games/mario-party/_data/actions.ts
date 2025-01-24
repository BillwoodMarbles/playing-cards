import ChanceTime from '../_components/ChanceTime'
import LuckyDescriptionBlock from '../_components/LuckyDescriptionBlock'
import ShopDisplay from '../_components/ShopDisplay'
import { Action, ActionId, ActionColor, ActionSpaceType } from '../_types/types'
import { FaExclamation, FaRecycle, FaStar } from 'react-icons/fa'
import {
  GiBank,
  GiBattleTank,
  GiEvilMinion,
  GiGhost,
  GiMushroom,
} from 'react-icons/gi'
import { TbMoneybag } from 'react-icons/tb'
import { LuClover } from 'react-icons/lu'

export const actions: Action[] = [
  {
    id: ActionId.BLUE,
    name: 'Blue',
    color: ActionColor.BLUE,
    type: ActionSpaceType.SPACE,
    description: 'Collect 3 coins',
  },
  {
    id: ActionId.LUCKY,
    name: 'Lucky',
    icon: LuClover,
    color: ActionColor.BLUE,
    type: ActionSpaceType.SPACE,
    description: 'Roll the dice and get the corresponding reward',
    component: LuckyDescriptionBlock,
  },
  {
    id: ActionId.CHANCE,
    name: 'Chance',
    icon: FaRecycle,
    color: ActionColor.BLUE,
    type: ActionSpaceType.SPACE,
    component: ChanceTime,
    description:
      'In any order, roll the player die twice and the chance time die once to determine the outcome',
  },
  {
    id: ActionId.VS,
    name: 'VS',
    icon: GiBattleTank,
    color: ActionColor.BLUE,
    type: ActionSpaceType.SPACE,
    description:
      'Play a All vs All Mini Game. landing player chooses to wager 5, 10, 15, 20, 25, or 30 coins. Winner takes all',
  },
  {
    id: ActionId.BANK,
    name: 'Bank',
    icon: GiBank,
    type: ActionSpaceType.SPACE,
    color: ActionColor.BLUE,
    description:
      'If passing the bank, deposit 5 coins. If landing on the bank, collect all coins in the bank',
  },
  {
    id: ActionId.RED,
    name: 'Red',
    color: ActionColor.RED,
    type: ActionSpaceType.SPACE,
    description: 'Lose 3 coins',
  },
  {
    id: ActionId.BOWSER,
    name: 'Bowser',
    icon: GiEvilMinion,
    color: ActionColor.RED,
    type: ActionSpaceType.SPACE,
    description: 'Draw a Bowser card',
  },
  {
    id: ActionId.EVENT,
    name: 'Event',
    icon: FaExclamation,
    color: ActionColor.GREEN,
    type: ActionSpaceType.SPACE,
    description: 'Trigger board event (see board for details)',
  },
  {
    id: ActionId.ITEM,
    name: 'Item',
    icon: GiMushroom,
    color: ActionColor.GREEN,
    type: ActionSpaceType.SPACE,
    description: 'Draw an Item card',
  },

  {
    id: ActionId.SHOP,
    name: 'Shop',
    icon: TbMoneybag,
    type: ActionSpaceType.PASS,
    description: 'Buy an Item for associated price (optional)',
    component: ShopDisplay,
  },
  {
    id: ActionId.BOO,
    name: 'Boo',
    icon: GiGhost,
    type: ActionSpaceType.PASS,
    description:
      'Steal coins (free) or a star (50 coins) from another player (optional). You may select the player to steal from or roll the player die',
  },
  {
    id: ActionId.STAR,
    name: 'Star',
    icon: FaStar,
    type: ActionSpaceType.PASS,
    description: 'Buy a star for 20 coins (optional)',
  },
]
