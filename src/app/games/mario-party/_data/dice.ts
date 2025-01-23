import { IoDice } from 'react-icons/io5'
import { Die, DieType } from '../_types/types'
import { FaRecycle } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'

export const dice: Die[] = [
  {
    name: 'Movement',
    color: 'red',
    values: [1, 2, 3, 4, 5, 6],
    type: DieType.MOVEMENT,
    icon: IoDice,
  },
  {
    name: 'Player',
    color: 'blue',
    values: ['mario', 'luigi', 'peach', 'yoshi', 'wario', 'waluigi'],
    icon: CgProfile,
    type: DieType.PLAYER,
  },
  {
    name: 'Chance',
    color: 'green',
    values: [
      'gives 10 coins',
      'recieves 10 coins',
      'gives 20 coins',
      'recieves 20 coins',
      'gives 30 coins',
      'recieves 30 coins',
      'gives star',
      'recieves star',
      'swap coins',
      'swap stars',
    ],
    type: DieType.CHANCE,
    icon: FaRecycle,
  },
]
