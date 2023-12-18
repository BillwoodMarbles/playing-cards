/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

import { Game } from "./app/types";

export type CreateGameInput = {
  id?: string | null;
  code: string;
  players: string;
  playerTurn: string;
  deck: string;
  discardDeck: string;
  status: string;
  rounds?: string | null;
  currentRound: number;
  gameType: string;
  lastMove?: string | null;
};

export type ModelGameConditionInput = {
  code?: ModelStringInput | null;
  players?: ModelStringInput | null;
  playerTurn?: ModelStringInput | null;
  deck?: ModelStringInput | null;
  discardDeck?: ModelStringInput | null;
  status?: ModelStringInput | null;
  rounds?: ModelStringInput | null;
  currentRound?: ModelIntInput | null;
  gameType?: ModelStringInput | null;
  lastMove?: ModelStringInput | null;
  and?: Array<ModelGameConditionInput | null> | null;
  or?: Array<ModelGameConditionInput | null> | null;
  not?: ModelGameConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

// export type Game = {
//   __typename: "Game",
//   id: string,
//   code: string,
//   players: string,
//   playerTurn: string,
//   deck: string,
//   discardDeck: string,
//   status: string,
//   rounds?: string | null,
//   currentRound: number,
//   gameType: string,
//   lastMove?: string | null,
//   createdAt: string,
//   updatedAt: string,
// };

export type UpdateGameInput = {
  id: string;
  code?: string | null;
  players?: string | null;
  playerTurn?: string | null;
  deck?: string | null;
  discardDeck?: string | null;
  status?: string | null;
  rounds?: string | null;
  currentRound?: number | null;
  gameType?: string | null;
  lastMove?: string | null;
};

export type DeleteGameInput = {
  id: string;
};

export type ModelGameFilterInput = {
  id?: ModelIDInput | null;
  code?: ModelStringInput | null;
  players?: ModelStringInput | null;
  playerTurn?: ModelStringInput | null;
  deck?: ModelStringInput | null;
  discardDeck?: ModelStringInput | null;
  status?: ModelStringInput | null;
  rounds?: ModelStringInput | null;
  currentRound?: ModelIntInput | null;
  gameType?: ModelStringInput | null;
  lastMove?: ModelStringInput | null;
  and?: Array<ModelGameFilterInput | null> | null;
  or?: Array<ModelGameFilterInput | null> | null;
  not?: ModelGameFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelGameConnection = {
  __typename: "ModelGameConnection";
  items: Array<Game | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionGameFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  code?: ModelSubscriptionStringInput | null;
  players?: ModelSubscriptionStringInput | null;
  playerTurn?: ModelSubscriptionStringInput | null;
  deck?: ModelSubscriptionStringInput | null;
  discardDeck?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  rounds?: ModelSubscriptionStringInput | null;
  currentRound?: ModelSubscriptionIntInput | null;
  gameType?: ModelSubscriptionStringInput | null;
  lastMove?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionGameFilterInput | null> | null;
  or?: Array<ModelSubscriptionGameFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  in?: Array<number | null> | null;
  notIn?: Array<number | null> | null;
};

export type CreateGameMutationVariables = {
  input: CreateGameInput;
  condition?: ModelGameConditionInput | null;
};

export type CreateGameMutation = {
  createGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateGameMutationVariables = {
  input: UpdateGameInput;
  condition?: ModelGameConditionInput | null;
};

export type UpdateGameMutation = {
  updateGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteGameMutationVariables = {
  input: DeleteGameInput;
  condition?: ModelGameConditionInput | null;
};

export type DeleteGameMutation = {
  deleteGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type GetGameQueryVariables = {
  id: string;
};

export type GetGameQuery = {
  getGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListGamesQueryVariables = {
  filter?: ModelGameFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListGamesQuery = {
  listGames?: {
    __typename: "ModelGameConnection";
    items: Array<{
      __typename: "Game";
      id: string;
      code: string;
      players: string;
      playerTurn: string;
      deck: string;
      discardDeck: string;
      status: string;
      rounds?: string | null;
      currentRound: number;
      gameType: string;
      lastMove?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OnCreateGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null;
};

export type OnCreateGameSubscription = {
  onCreateGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null;
};

export type OnUpdateGameSubscription = {
  onUpdateGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null;
};

export type OnDeleteGameSubscription = {
  onDeleteGame?: {
    __typename: "Game";
    id: string;
    code: string;
    players: string;
    playerTurn: string;
    deck: string;
    discardDeck: string;
    status: string;
    rounds?: string | null;
    currentRound: number;
    gameType: string;
    lastMove?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};
