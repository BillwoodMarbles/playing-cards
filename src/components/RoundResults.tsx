import React from 'react'
import { getCurrentRoundWinner, getGameWinner, isWildCard } from '../utils/game'
import { useGameContext } from '../contexts/GameContext'
import HandContainer from './HandContainer'
import CardComponent from './Card'
const RoundResults = () => {
  const { game } = useGameContext()
  const roundWinner = getCurrentRoundWinner(game)

  const isLastRound = () => {
    return game.currentRound === game.rounds.length - 1
  }

  return (
    <>
      {!isLastRound() ? (
        <>
          <strong>{getCurrentRoundWinner(game)?.name}</strong> won the round!
        </>
      ) : (
        <>
          <strong>{getGameWinner(game)?.name}</strong> clapped Grannie&apos;s
          cheeks!
        </>
      )}

      <HandContainer>
        {roundWinner?.cards.map((card, index) => {
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
    </>
  )
}

export default RoundResults
