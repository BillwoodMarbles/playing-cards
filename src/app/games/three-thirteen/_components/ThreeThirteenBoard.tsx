import ConfigureGameForm from '@/components/ConfigureGameForm'
import Deck from '@/components/Deck'
import GameAlert from '@/components/GameAlert'
import Hand from '@/components/Hand'
import HandSortButtons from '@/components/HandSortButtons'
import Header from '@/components/Header'
import JoinGameForm from '@/components/JoinGameForm'
import GameNotifications from '@/components/Notifications'
import PlayerCTAs from '@/components/PlayerCTAs'
import Players from '@/components/Players'
import ReportScoreForm from '@/components/ReportScoreForm'
import RoundResults from '@/components/RoundResults'
import { useGameContext } from '@/contexts/GameContext'
import { usePlayerContext } from '@/contexts/PlayerContext'
import useAnimations from '@/hooks/useAnimations'
import useGame from '@/hooks/useGame'
import { Card, PLAYER_ACTION } from '@/types/types'
import React, { useEffect, useState } from 'react'

const ThreeThirteenBoard = () => {
  const { game, currentRound, updateGameState } = useGameContext()
  const { myPlayer, currentAction, completeAction, resetActions } =
    usePlayerContext()

  const { getDeckAnimation } = useAnimations(game, myPlayer)
  const {
    discardCard,
    drawCardFromPrimaryDeck,
    drawCardFromDiscardDeck,
    burnCardFromPrimaryDeck,
  } = useGame(game, myPlayer)

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showWinnerAlert, setShowWinnerAlert] = useState(false)

  const handleCardInHandClick = (card: Card) => {
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null)
    } else {
      setSelectedCard(card)
    }
  }

  const handleDrawCard = () => {
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

  const handleDiscardClick = () => {
    if (
      currentAction?.availableActions.includes(PLAYER_ACTION.DISCARD) &&
      selectedCard
    ) {
      const newGame = discardCard(selectedCard)

      if (!newGame) {
        return
      }

      updateGameState(newGame)

      if (selectedCard.status === 'visible-deck-draw') {
        completeAction(PLAYER_ACTION.DISCARD_DRAWN_CARD)
      } else {
        completeAction(PLAYER_ACTION.DISCARD)
      }

      setSelectedCard(null)
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

  return (
    <>
      <Header />
      <GameNotifications />

      {game.players.length > 0 && (
        <div className="relative w-full border-b border-white bg-slate-100 px-3 py-4">
          <Players playerTurn={game.playerTurn} players={game.players} />
        </div>
      )}

      <div className="w-full bg-slate-100">
        {!game.code && (
          <div className="mx-auto w-full max-w-sm py-6">
            <ConfigureGameForm gameType={game.gameType} />
          </div>
        )}

        {game.code && game.status === 'open' && !myPlayer?.id && (
          <div className="mx-auto w-full max-w-sm py-6">
            <JoinGameForm />
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="relative flex w-full grow flex-col items-center justify-center bg-slate-100 py-6">
        {showWinnerAlert && <GameAlert alertText="GRANDMA!!!" />}

        {currentRound?.status === 'complete' && (
          <>
            <RoundResults />
            <ReportScoreForm />
          </>
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
                onClick={handleDrawCard}
                animation={getDeckAnimation('deck')}
              />
            </div>

            <div className="mx-1">
              <Deck
                cards={game.discardDeck}
                enabled={Boolean(
                  currentAction?.availableActions.includes(
                    PLAYER_ACTION.DRAW
                  ) ||
                    (currentAction?.availableActions.includes(
                      PLAYER_ACTION.DISCARD
                    ) &&
                      selectedCard)
                )}
                showTopCard
                onClick={handleDiscardClick}
                animation={getDeckAnimation('discard')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Player Area */}
      <div className="relative z-20 w-full grow-0 bg-slate-100 pb-4">
        <PlayerCTAs />

        <Hand
          game={game}
          peekedCards={[]}
          player={myPlayer}
          cards={myPlayer?.cards || []}
          selectedCard={selectedCard}
          onClick={handleCardInHandClick}
        />

        <HandSortButtons selectedCard={selectedCard} />
      </div>
    </>
  )
}

export default ThreeThirteenBoard
