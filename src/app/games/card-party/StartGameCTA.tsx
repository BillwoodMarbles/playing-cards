import { useGameContext } from '@/app/contexts/GameContext'
import { usePlayerContext } from '@/app/contexts/PlayerContext'
import { getPartyCardDeckWithConfig } from '@/app/data/party-cards'
import { Round } from '@/app/types'
import { shuffleCards } from '@/app/utils/cards'
import React, { FC } from 'react'

interface StartGameCTAProps {
  cardList: { [key: string]: boolean }
}

const StartGameCTA: FC<StartGameCTAProps> = ({ cardList }) => {
  const { game, updateGameState } = useGameContext()
  const { myPlayer } = usePlayerContext()

  const startGame = () => {
    try {
      const newGame = { ...game }

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

  return (
    <button
      className="mx-1 rounded-md bg-blue-300 px-6 py-2 shadow-md"
      onClick={startGame}
    >
      Start Game
    </button>
  )
}

export default StartGameCTA
