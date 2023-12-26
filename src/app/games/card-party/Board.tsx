import Deck from '@/app/components/Deck'
import Header from '@/app/components/Header'
import { useGame as GameContext } from '@/app/contexts/GameContext'
import { usePlayer } from '@/app/contexts/PlayerContext'
import {
  MiniGameRequirements,
  MiniGameType,
  getMiniGameByTitle,
  getPartyCardDeckWithConfig,
  getRequirementIcon,
  partyCards,
} from '@/app/data/party-cards'
import useAnimations from '@/app/hooks/useAnimations'
import useGame from '@/app/hooks/useGame'
import { Card, PLAYER_ACTION, Round } from '@/app/types'
import { shuffleCards } from '@/app/utils/cards'
import React, { FC, useState } from 'react'

const PartyBoard: FC = () => {
  const { game, myPlayer, updateGameState } = GameContext()
  const { burnCardFromPrimaryDeck, revealCard: RevealCard } = useGame(
    game,
    myPlayer
  )

  const { currentAction, completeAction } = usePlayer()
  const { getDeckAnimation } = useAnimations(game, myPlayer)
  const [requirementToggles, setRequirementToggles] = useState<
    { requirement: MiniGameRequirements; toggled: boolean }[]
  >([
    { requirement: 'none', toggled: true },
    { requirement: 'dice', toggled: true },
    { requirement: 'cards', toggled: true },
    { requirement: 'coins', toggled: true },
    { requirement: 'shot-glass', toggled: true },
    { requirement: 'standing', toggled: true },
    { requirement: 'drinking', toggled: true },
    { requirement: 'drawing', toggled: true },
  ])

  const buildCardList = () => {
    const cardList: { [key in MiniGameType]?: boolean } = {}

    partyCards.forEach((card) => {
      cardList[card.title] = true
    })

    return cardList
  }

  const [cardList, setCardList] =
    useState<{ [key in MiniGameType]?: boolean }>(buildCardList())

  const topCard = game.deck[game.deck.length - 1]

  const revealCard = (card: Card) => {
    const newGame = RevealCard(card)
    updateGameState(newGame)
    completeAction(PLAYER_ACTION.REVEAL_CARD)
  }

  const getCountOfAllToggledGames = () => {
    return Object.values(cardList).filter((item) => item).length
  }

  const burdCard = () => {
    const newGame = burnCardFromPrimaryDeck()
    updateGameState(newGame)
    completeAction(PLAYER_ACTION.DRAW)
  }

  const startGame = () => {
    try {
      const newGame = { ...game }
      // const gameConfig = getGameConfig(newGame.gameType)

      // validate
      // if (game.players.length > gameConfig.maxPlayers) {
      //   alert(
      //     `You can only have ${gameConfig.maxPlayers} players to start a game`
      //   );
      //   throw new Error("Too many players to start game");
      // }

      // start game
      if (!newGame.rounds.length) {
        const rounds: Round[] = []
        for (let i = 0; i < 1; i++) {
          rounds.push({
            id: i,
            status: 'open',
            drawCount: 0,
            roundWinner: '',
            dealer: '',
            turnCount: 0,
          })
        }
        newGame.rounds = rounds
      }

      newGame.currentRound = (newGame.currentRound + 1) % newGame.rounds.length
      newGame.deck = shuffleCards(getPartyCardDeckWithConfig(cardList))
      newGame.discardDeck = []

      // set round status to open
      const newRounds = [...newGame.rounds]
      newRounds[newGame.currentRound].status = 'open'

      newGame.status = 'in-progress'

      newGame.lastMove = {
        playerId: myPlayer?.id || '',
        action: 'new-game',
        card: null,
      }

      updateGameState(newGame)
    } catch (err) {
      console.error('error starting game', err)
    }
  }

  const showBurnCardCTA = () => {
    return topCard?.status === 'visible'
  }

  const showStartGameCTA = () => {
    return game.status === 'open' && getCountOfAllToggledGames() > 0
  }

  const getRequirementIconComponent = (item: {
    requirement: MiniGameRequirements
    toggled?: boolean
  }) => {
    const IconComponent = getRequirementIcon(item.requirement)
    if (!IconComponent) {
      return null
    }
    return <IconComponent className={item.toggled ? 'text-white' : ''} />
  }

  const getGamesList = () => {
    const gamesByRequirement = Object.keys(cardList).reduce(
      (acc, key) => {
        const miniGame = getMiniGameByTitle(key as MiniGameType)
        if (miniGame === undefined) {
          return acc
        }

        // merge requirements into one string
        const requirement = miniGame.requirements?.join('-')

        if (requirement) {
          if (!acc[requirement]) {
            acc[requirement] = []
          }

          acc[requirement].push(miniGame)
        } else {
          if (!acc['none']) {
            acc['none'] = []
          }

          acc['none'].push(miniGame)
        }

        return acc
      },
      {} as { [key: string]: typeof partyCards }
    )

    // sort by mini game title
    Object.entries(gamesByRequirement).forEach((entries) => {
      entries[1].sort((a, b) => {
        if (a.title < b.title) {
          return -1
        }

        if (a.title > b.title) {
          return 1
        }

        return 0
      })
    })

    return Object.entries(gamesByRequirement).map(
      ([requirement, miniGames]) => (
        <div key={requirement}>
          <hr className="border-gray-400" />
          {miniGames.map((miniGame) => (
            <div
              key={miniGame.title}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                {miniGame.title}
                <em className="ml-2 text-sm text-gray-500">
                  {miniGame.isBeta && 'beta'}
                </em>
              </div>

              <div className="flex items-center">
                <div className="flex h-full items-center px-4">
                  {miniGame.requirements?.map((line, index) => (
                    <div
                      key={index}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-lg"
                    >
                      {getRequirementIconComponent({ requirement: line })}
                    </div>
                  ))}
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="mini-game"
                    checked={cardList[miniGame.title]}
                    className="mr-2"
                    onChange={() => {
                      setCardList({
                        ...cardList,
                        [miniGame.title]: !cardList[miniGame.title],
                      })
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )
    )
  }

  const toggleAllGamesOfRequirement = (
    requirement: MiniGameRequirements,
    toggled: boolean
  ) => {
    const newCardList = { ...cardList }

    partyCards.forEach((card) => {
      if (requirement === 'none') {
        if (!card.requirements?.length) {
          newCardList[card.title] = toggled
        }
        return
      }

      if (card.requirements?.includes(requirement)) {
        newCardList[card.title] = toggled
      }
    })

    setCardList(newCardList)
  }

  return (
    <>
      <Header />

      {game.status === 'open' && (
        <div className="w-full px-4 py-6 pb-14">
          <h2 className="text-lg font-bold">
            Games List ({getCountOfAllToggledGames()})
          </h2>

          <div className="flex items-center justify-between py-2">
            {requirementToggles.map((line, index) => {
              return (
                <div
                  onClick={() => {
                    setRequirementToggles(
                      requirementToggles.map((item) => {
                        if (item.requirement === line.requirement) {
                          return {
                            ...item,
                            toggled: !item.toggled,
                          }
                        }

                        return item
                      })
                    )
                    toggleAllGamesOfRequirement(line.requirement, !line.toggled)
                  }}
                  key={index}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 text-lg ${
                    line.toggled ? 'border-sky-100 bg-sky-500 text-white' : ''
                  }`}
                >
                  {getRequirementIconComponent(line)}
                </div>
              )
            })}
          </div>

          {getGamesList()}
        </div>
      )}
      {game.status === 'in-progress' && (
        <div className="relative flex w-full grow flex-col items-center justify-center overflow-x-hidden bg-slate-100 px-4 py-6">
          <div className="mb-6 flex w-full  flex-col justify-center ">
            <Deck
              size="full"
              cards={game.deck}
              enabled={Boolean(
                currentAction?.availableActions.includes(
                  PLAYER_ACTION.REVEAL_CARD
                )
              )}
              onClick={revealCard}
              animation={getDeckAnimation('deck')}
              disabledPulse
            />
          </div>
        </div>
      )}

      <div className="relative z-20 w-full grow-0 bg-slate-100 pb-4">
        <div className="fixed bottom-0 left-0 flex w-full justify-center border-t-2 bg-white py-3">
          {showStartGameCTA() && (
            <button
              className="mx-1 rounded-md bg-blue-300 px-6 py-2 shadow-md"
              onClick={startGame}
            >
              Start Game
            </button>
          )}

          {showBurnCardCTA() && (
            <button
              className="mx-1 rounded-md bg-blue-300 px-6 py-2 shadow-md"
              onClick={burdCard}
            >
              Discard
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default PartyBoard
