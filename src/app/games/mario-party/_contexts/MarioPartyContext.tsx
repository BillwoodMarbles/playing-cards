// Import necessary modules
import React, { createContext, FC, useContext, useReducer } from 'react'
import { Characters, ItemCard, MarioPartyPlayer } from '../_types/types'

enum BoardType {
  YOSHIS_TROPICAL_ISLAND = "Yoshi's Tropical Island",
}

// Create contexts
interface GameContextValue {
  settings: {
    board: BoardType
  }
  players: MarioPartyPlayer[]
  shop: ItemCard[]
}

const defaultPlayers: MarioPartyPlayer[] = [
  {
    id: '1',
    character: Characters.MARIO,
    stars: 0,
    coins: 0,
    items: [],
    color: 'red',
  },
  {
    id: '2',
    character: Characters.LUIGI,
    stars: 0,
    coins: 0,
    items: [],
    color: 'green',
  },
  {
    id: '3',
    character: Characters.PEACH,
    stars: 0,
    coins: 0,
    items: [],
    color: 'pink',
  },
  {
    id: '4',
    character: Characters.YOSHI,
    stars: 0,
    coins: 0,
    items: [],
    color: 'blue',
  },
  {
    id: '5',
    character: Characters.WARIO,
    stars: 0,
    coins: 0,
    items: [],
    color: 'yellow',
  },
  {
    id: '6',
    character: Characters.WALUIGI,
    stars: 0,
    coins: 0,
    items: [],
    color: 'purple',
  },
]

// Define initial state
const initialState: GameContextValue = {
  settings: {
    board: BoardType.YOSHIS_TROPICAL_ISLAND,
  },
  players: defaultPlayers,
  shop: [],
}

// Define action types
enum ActionType {
  UPDATE_COINS = 'UPDATE_COINS',
  UPDATE_STARS = 'UPDATE_STARS',
  ADD_ITEM = 'ADD_ITEM',
  USE_ITEM = 'USE_ITEM',
  ADD_ITEM_TO_SHOP = 'ADD_ITEM_TO_SHOP',
  REMOVE_ITEM_FROM_SHOP = 'REMOVE_ITEM_FROM_SHOP',
}

type GameAction =
  | {
      type: ActionType.UPDATE_COINS
      payload: { id: string; coins: number }
    }
  | {
      type: ActionType.UPDATE_STARS
      payload: { id: string; stars: number }
    }
  | {
      type: ActionType.ADD_ITEM
      payload: { id: string; item: ItemCard }
    }
  | {
      type: ActionType.USE_ITEM
      payload: { id: string; item: ItemCard }
    }
  | {
      type: ActionType.ADD_ITEM_TO_SHOP
      payload: { item: ItemCard }
    }
  | {
      type: ActionType.REMOVE_ITEM_FROM_SHOP
      payload: { item: ItemCard }
    }

// Reducer function
const gameReducer = (state: GameContextValue, action: GameAction) => {
  switch (action.type) {
    case ActionType.UPDATE_COINS:
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.payload.id
            ? { ...player, coins: action.payload.coins + player.coins }
            : player
        ),
      }
    case ActionType.UPDATE_STARS:
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.payload.id
            ? { ...player, stars: action.payload.stars + player.stars }
            : player
        ),
      }
    case ActionType.ADD_ITEM:
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.payload.id
            ? { ...player, items: [...player.items, action.payload.item] }
            : player
        ),
      }
    case ActionType.USE_ITEM:
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.payload.id
            ? {
                ...player,
                items: player.items.filter(
                  (item) => item !== action.payload.item
                ),
              }
            : player
        ),
      }
    case ActionType.ADD_ITEM_TO_SHOP:
      return {
        ...state,
        shop: [...state.shop, action.payload.item],
      }
    case ActionType.REMOVE_ITEM_FROM_SHOP: {
      const itemIndex = state.shop.findIndex(
        (item) => item === action.payload.item
      )
      if (itemIndex === -1) return state

      return {
        ...state,
        shop: [
          ...state.shop.slice(0, itemIndex),
          ...state.shop.slice(itemIndex + 1),
        ],
      }
    }
    default:
      throw new Error(`Unhandled action type: ${action}`)
  }
}

const GameStateContext = createContext<GameContextValue>(initialState)
const GameDispatchContext = createContext((() => 0) as React.Dispatch<any>)

// Provider component
interface GameProviderProps {
  children: React.ReactNode
}
export const GameProvider: FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}

// Custom hooks for accessing state and dispatch
export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider')
  }
  return context
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext)
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider')
  }
  return context
}

// Example action creator
export function updatePlayerCoins(id: string, coins: number) {
  return { type: ActionType.UPDATE_COINS, payload: { id, coins } }
}
export function updatePlayerStars(id: string, stars: number) {
  return { type: ActionType.UPDATE_STARS, payload: { id, stars } }
}
export function addItemToPlayer(id: string, item: ItemCard) {
  return { type: ActionType.ADD_ITEM, payload: { id, item } }
}
export function useItem(id: string, item: ItemCard) {
  return { type: ActionType.USE_ITEM, payload: { id, item } }
}
export function addItemToShop(item: ItemCard) {
  return { type: ActionType.ADD_ITEM_TO_SHOP, payload: { item } }
}
export function removeItemFromShop(item: ItemCard) {
  return { type: ActionType.REMOVE_ITEM_FROM_SHOP, payload: { item } }
}
