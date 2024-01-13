'use client'

import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../../amplifyconfiguration.json'
import CardComponent from '../components/Card'
import {
  FaAngleLeft,
  FaAngleRight,
  FaMinus,
  FaPlus,
  FaShuffle,
} from 'react-icons/fa6'
import { Card, PLAYER_ACTION } from '../types'
import GameNotifications from '../components/Notifications'
import HandContainer from '../components/HandContainer'
import Players from '../components/Players'
import { GameTypes, getGameConfig } from '../data/game-configs'
import '../styles/animations.css'
import useAnimations from '../hooks/useAnimations'
import { getPlayerIndexById } from '../utils/player'
import Deck from '../components/Deck'
import Hand from '../components/Hand'
import { getCurrentRoundWinner, getGameWinner, isWildCard } from '../utils/game'
import PlayerCTAs from '../components/PlayerCTAs'
import Header from '../components/Header'
import JoinGameForm from '../components/JoinGameForm'
import { useGameContext } from '../contexts/GameContext'
import { usePlayerContext } from '../contexts/PlayerContext'
import useGame from '../hooks/useGame'
import React from 'react'

Amplify.configure(amplifyconfig)

const GamePage: FC = () => {
  const { currentRound, game, updateGameState } = useGameContext()
  const { currentAction, myPlayer, completeAction, resetActions } =
    usePlayerContext()

  const {
    burnCardFromPrimaryDeck,
    drawCardFromDiscardDeck,
    drawCardFromPrimaryDeck,
    dealCardsToPlayers,
    initializeRound,
    newGame: NewGame,
    startGame: StartGame,
  } = useGame(game, myPlayer)
  const { getDeckAnimation } = useAnimations(game, myPlayer)
  const searchParams = useSearchParams()

  const [playerId, setPlayerId] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showWinnerAlert, setShowWinnerAlert] = useState(false)
  const [scoreToAdd, setScoreToAdd] = useState(0)
  const [peekedCards, setPeekedCards] = useState<Card[]>([])

  const gameConfig = getGameConfig(game.gameType)

  const newGame = () => {
    const newGame = NewGame()
    updateGameState(newGame)
  }

  const updateScoreToAdd = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      setScoreToAdd((prevValue) => prevValue + (gameConfig.pointCount || 1))
    } else {
      setScoreToAdd((prevValue) => prevValue - (gameConfig.pointCount || 1))
    }
  }

  const startNewRound = () => {
    const newGame = initializeRound()
    updateGameState(newGame)
  }

  const drawCard = () => {
    if (currentAction?.availableActions.includes(PLAYER_ACTION.DRAW)) {
      try {
        const newGame = drawCardFromPrimaryDeck()
        updateGameState(newGame)
        completeAction(PLAYER_ACTION.DRAW)
      } catch (err) {
        console.error('error drawing card', err)
      }
    }

    if (currentAction?.availableActions.includes(PLAYER_ACTION.BURN_CARD)) {
      try {
        const newGame = burnCardFromPrimaryDeck()
        updateGameState(newGame)
        completeAction(PLAYER_ACTION.BURN_CARD)
      } catch (err) {
        console.error('error burning card', err)
      }
    }
  }

  const discardPileClick = () => {
    if (
      currentAction?.availableActions.includes(PLAYER_ACTION.DISCARD) &&
      selectedCard
    ) {
      const newCard = { ...selectedCard }
      discardCard(newCard)
    }

    if (currentAction?.availableActions.includes(PLAYER_ACTION.DRAW)) {
      try {
        const newGame = drawCardFromDiscardDeck()
        updateGameState(newGame)
        completeAction(PLAYER_ACTION.DRAW)
      } catch (err) {
        console.error('error drawing card', err)
      }
    }
  }

  const changeCardOrder = (card: Card, orderAdjustment: number) => {
    if (game && myPlayer) {
      const playerIndex = game.players.findIndex(
        (player) => player.id === playerId
      )
      const newGame = { ...game }
      const newPlayerCards = [...myPlayer.cards]
      const cardIndex = newPlayerCards.findIndex((c) => c.id === card.id)
      const cardToSwap = newPlayerCards[cardIndex + orderAdjustment]
      if (!cardToSwap) {
        return
      }
      newPlayerCards[cardIndex + orderAdjustment] = card
      newPlayerCards[cardIndex] = cardToSwap
      newGame.players[playerIndex].cards = newPlayerCards
      updateGameState(newGame, true)
    }
  }

  const dealCards = () => {
    const newGame = dealCardsToPlayers()
    updateGameState(newGame)
  }

  const startGame = () => {
    try {
      const newGame = StartGame()
      updateGameState(newGame)
    } catch (err) {
      console.error('error starting game', err)
    }
  }

  const startTurn = () => {
    setPeekedCards([])
    completeAction(PLAYER_ACTION.START_TURN)
  }

  const discardCard = (card: Card) => {
    if (
      GameTypes.MINI_GOLF === game.gameType &&
      card.status === 'visible-never-discard'
    ) {
      return
    }

    if (card.status === 'visible-discard-draw') {
      return
    }

    const playerIndex = getPlayerIndexById(game, playerId)

    if (myPlayer && playerIndex !== null && playerIndex !== undefined) {
      const newGame = { ...game }
      const newDiscardDeck = [...newGame.discardDeck, card]
      newGame.discardDeck = newDiscardDeck
      const newPlayerCards = myPlayer.cards.filter((c) => c.id !== card.id)
      newGame.players[playerIndex].cards = newPlayerCards

      setSelectedCard(null)

      newGame.lastMove = {
        playerId: myPlayer.id,
        action: 'discard',
        card: card,
      }
      updateGameState(newGame)

      if (card.status === 'visible-deck-draw') {
        completeAction(PLAYER_ACTION.DISCARD_DRAWN_CARD)
      } else {
        completeAction(PLAYER_ACTION.DISCARD)
      }
    }
  }

  const isLastRound = () => {
    if (game) {
      return game.currentRound === game.rounds.length - 1
    }
  }

  const onCardInHandClick = (card: Card) => {
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null)
    } else {
      setSelectedCard(card)
    }
  }

  const revealCard = (card: Card) => {
    if (game) {
      const newGame = { ...game }
      const playerIndex = getPlayerIndexById(newGame, playerId)

      if (playerIndex === null || playerIndex === undefined) {
        return
      }

      const cardIndex = newGame.players[playerIndex].cards.findIndex(
        (c) => c.id === card.id
      )

      if (cardIndex >= 0) {
        newGame.players[playerIndex].cards[cardIndex].status =
          'visible-never-discard'
        newGame.lastMove = {
          playerId: myPlayer?.id || '',
          action: 'reveal-card',
          card: card,
        }
        updateGameState(newGame)
        completeAction(PLAYER_ACTION.REVEAL_CARD)
      }
    }
  }

  const onPeekCard = (card: Card) => {
    if (!game) {
      return
    }

    if (peekedCards.length >= 2) {
      return
    }

    if (peekedCards.find((c) => c.id === card.id)) {
      return
    }

    setPeekedCards((prevValue) => [...prevValue, card])
  }

  const sortHand = () => {
    if (!game || !myPlayer) {
      return
    }

    // sort player cards by value
    const sortedCards = [...myPlayer.cards].sort((a, b) => {
      if (a.value === undefined || b.value === undefined) {
        return 0
      }
      return a.value - b.value
    })

    const newGame = { ...game }
    const playerIndex = newGame.players.findIndex(
      (player) => player.id === playerId
    )
    newGame.players[playerIndex].cards = sortedCards
    updateGameState(newGame, true)
  }

  const onReportScore = () => {
    if (game) {
      const newGame = { ...game }

      newGame.players.forEach((player) => {
        if (player.id === playerId) {
          player.score += scoreToAdd
        }
      })

      setScoreToAdd(0)

      newGame.lastMove = {
        playerId: myPlayer?.id || '',
        action: 'report-score',
        card: null,
      }
      updateGameState(newGame)
    }
  }

  useEffect(() => {
    if (game?.lastMove) {
      if (game.lastMove.action === 'claim-round') {
        setShowWinnerAlert(true)
        setTimeout(() => {
          setShowWinnerAlert(false)
        }, 3000)
      }

      if (
        game.lastMove?.action === 'new-game' ||
        game.lastMove?.action === 'start-round' ||
        game.lastMove?.action === 'new-deal' ||
        game.lastMove?.action === 'end-turn'
      ) {
        resetActions()
      }
    }
  }, [game])

  useEffect(() => {
    const playerId = searchParams.get('playerId')

    if (playerId) {
      setPlayerId(playerId)
    }
  }, [searchParams])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />

      {game.status === 'open' && !playerId && <JoinGameForm />}

      <GameNotifications />

      <div className="relative w-full bg-slate-100 px-3 py-4">
        {game.players.length > 0 && (
          <Players playerTurn={game.playerTurn} players={game.players} />
        )}
      </div>

      <div className="relative flex w-full grow flex-col items-center justify-center bg-slate-100 py-6">
        <div className="w-full">
          {showWinnerAlert && (
            <div className="winner-alert absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center">
              <strong className="text-5xl text-violet-600">GRANDMA!</strong>
            </div>
          )}

          {game.status === 'in-progress' && (
            <>
              {currentRound?.status === 'complete' &&
                gameConfig.type === GameTypes.GRANDMA && (
                  <div>
                    <h2 className="text-center text-base text-violet-600">
                      {!isLastRound() ? (
                        <>
                          <strong>{getCurrentRoundWinner(game)?.name}</strong>{' '}
                          won the round!
                        </>
                      ) : (
                        <>
                          <strong>{getGameWinner(game)?.name}</strong> clapped
                          Grannie&apos;s cheeks!
                        </>
                      )}
                    </h2>

                    <HandContainer>
                      {getCurrentRoundWinner(game)?.cards.map((card, index) => {
                        return (
                          <>
                            <div
                              key={card.id}
                              style={{
                                minWidth: '2rem',
                                maxWidth: '6rem',
                                zIndex: index,
                              }}
                              className="relative h-14 w-12"
                            >
                              <div className="absolute left-0 top-0">
                                <CardComponent
                                  key={card.id}
                                  card={card}
                                  disabled
                                  size="small"
                                  index={index}
                                  animation="new-deal"
                                  wild={isWildCard(game, card)}
                                />
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </HandContainer>
                  </div>
                )}

              {(currentRound?.status === 'in-progress' ||
                currentRound?.status === 'last-turn') && (
                <div className="mb-6 flex justify-center">
                  <div className="mx-1">
                    <Deck
                      cards={game.deck}
                      enabled={Boolean(
                        currentAction?.availableActions.includes(
                          PLAYER_ACTION.DRAW
                        ) ||
                          currentAction?.availableActions.includes(
                            PLAYER_ACTION.BURN_CARD
                          )
                      )}
                      onClick={drawCard}
                      animation={getDeckAnimation('deck')}
                    />
                  </div>

                  <div className="mx-1">
                    {game.discardDeck.length > 0 &&
                    game.discardDeck[game.discardDeck.length - 1] ? (
                      (() => {
                        const card =
                          game.discardDeck[game.discardDeck.length - 1]
                        return (
                          <div className="relative">
                            {(currentAction?.availableActions.includes(
                              PLAYER_ACTION.DRAW
                            ) ||
                              (currentAction?.availableActions.includes(
                                PLAYER_ACTION.DISCARD
                              ) &&
                                selectedCard)) && (
                              <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
                                <div className="h-3/5 w-3/5 animate-ping rounded-md bg-blue-500"></div>
                              </div>
                            )}

                            {game.lastMove?.card &&
                              game.lastMove.card.id >= 0 &&
                              (game.lastMove.action === 'draw-from-discard' ||
                                game.lastMove.action === 'discard') && (
                                <div
                                  className={`absolute left-0 top-0 ${
                                    game.lastMove.action === 'discard'
                                      ? 'z-0'
                                      : 'z-20'
                                  }`}
                                >
                                  <CardComponent
                                    card={
                                      game.lastMove.action ===
                                      'draw-from-discard'
                                        ? card
                                        : game.discardDeck[
                                            game.discardDeck.length - 2
                                          ]
                                    }
                                    disabled={
                                      !(
                                        currentAction?.availableActions.includes(
                                          PLAYER_ACTION.DRAW
                                        ) ||
                                        currentAction?.availableActions.includes(
                                          PLAYER_ACTION.DISCARD
                                        )
                                      )
                                    }
                                    onClick={discardPileClick}
                                    animation={getDeckAnimation('discard-bg')}
                                  />
                                </div>
                              )}

                            <div className="relative z-10">
                              {/* <span>{game.discardDeck.length}</span> */}
                              <CardComponent
                                wild={isWildCard(game, card)}
                                key={card.id}
                                card={card}
                                onClick={discardPileClick}
                                disabled={
                                  !(
                                    currentAction?.availableActions.includes(
                                      PLAYER_ACTION.DRAW
                                    ) ||
                                    currentAction?.availableActions.includes(
                                      PLAYER_ACTION.DISCARD
                                    )
                                  )
                                }
                                animation={getDeckAnimation('discard')}
                              />
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="relative">
                        {currentAction?.availableActions.includes(
                          PLAYER_ACTION.DISCARD
                        ) &&
                          selectedCard && (
                            <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
                              <div className="h-3/5 w-3/5 animate-ping rounded-md bg-blue-500"></div>
                            </div>
                          )}
                        <CardComponent onClick={discardPileClick} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentRound?.status === 'complete' && (
                <>
                  <div className="my-4 w-full border border-white bg-slate-50 py-3">
                    <div className="mb-4 flex items-center justify-center">
                      <button
                        className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-red-300 px-2 py-1 shadow-md"
                        onClick={() => updateScoreToAdd('minus')}
                      >
                        <FaMinus />
                      </button>
                      <div className="w-8 text-center">
                        <span className="text-lg font-bold">{scoreToAdd}</span>
                      </div>
                      <button
                        className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-violet-300 px-2 py-1 shadow-md"
                        onClick={() => updateScoreToAdd('plus')}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        className="mx-1 rounded-md bg-blue-300 px-6 py-2 align-middle shadow-md"
                        onClick={onReportScore}
                      >
                        Save Score{' '}
                        <span className="">
                          ({(myPlayer?.score || 0) + scoreToAdd})
                        </span>
                      </button>
                    </div>
                  </div>

                  {!isLastRound() && myPlayer?.type === 'host' && (
                    <div className="flex justify-center">
                      <button
                        className="mx-1 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                        onClick={startNewRound}
                      >
                        Start New Round
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="relative z-20 w-full grow-0 bg-slate-100 pb-4">
        <div className="absolute bottom-full left-0 flex w-full justify-center">
          {currentRound?.status === 'complete' && isLastRound() && (
            <button
              className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
              onClick={newGame}
            >
              New Game
            </button>
          )}
          {game.status === 'open' &&
            myPlayer?.type === 'host' &&
            game.players.length >= gameConfig.minPlayers && (
              <button
                className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                onClick={startGame}
              >
                Start Game
              </button>
            )}
          {currentRound?.status === 'open' &&
            playerId &&
            currentRound?.dealer === playerId && (
              <button
                className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                onClick={dealCards}
              >
                Deal
              </button>
            )}

          {currentAction?.availableActions.includes(
            PLAYER_ACTION.REVEAL_CARD
          ) &&
            selectedCard && (
              <button
                className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                onClick={() => revealCard(selectedCard)}
              >
                Reveal Card
              </button>
            )}

          {currentAction?.availableActions.includes(PLAYER_ACTION.PEEK) && (
            <>
              {peekedCards.length < 2 && selectedCard && (
                <button
                  className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                  onClick={() => onPeekCard(selectedCard)}
                >
                  Peek at Card
                </button>
              )}

              {peekedCards.length >= 2 && (
                <button
                  className="mx-1 mb-2 rounded-md bg-blue-300 px-6 py-2 shadow-md"
                  onClick={startTurn}
                >
                  Start Turn
                </button>
              )}
            </>
          )}

          <PlayerCTAs />
        </div>

        <div className="relative">
          {selectedCard && game.gameType !== GameTypes.MINI_GOLF && (
            <>
              <div className="absolute -left-4 top-1/2 z-50 flex -translate-y-1/2 items-center">
                <button
                  className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 px-2 py-1 shadow-md"
                  onClick={() => changeCardOrder(selectedCard, -1)}
                >
                  <FaAngleLeft />
                </button>
              </div>

              <div className="absolute -right-4 top-1/2 z-50 flex -translate-y-1/2 items-center">
                <button
                  className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 px-2 py-1 shadow-md"
                  onClick={() => changeCardOrder(selectedCard, 1)}
                >
                  <FaAngleRight />
                </button>
              </div>
            </>
          )}
          <Hand
            game={game}
            peekedCards={peekedCards}
            player={myPlayer}
            cards={myPlayer?.cards || []}
            selectedCard={selectedCard}
            onClick={onCardInHandClick}
          />
        </div>
      </div>

      {Boolean(myPlayer?.cards?.length) &&
        !selectedCard &&
        (game.gameType !== GameTypes.MINI_GOLF ||
          currentRound?.status === 'complete') && (
          <div className="absolute -bottom-4 right-0 z-50 flex -translate-y-1/2 items-center">
            <button
              className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 px-2 py-1 shadow-md"
              onClick={() => sortHand()}
            >
              <FaShuffle />
            </button>
          </div>
        )}
    </>
  )
}

export default GamePage
