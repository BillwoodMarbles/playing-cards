import React, { FC, useEffect, useMemo, useState } from 'react'
import { Card, CardDeck } from '../_types/types'
import { buildDeck } from '../_utils/buildDeck'

interface DeckProps {
  deck: CardDeck
  onDrawCard: (card: Card) => void
}
const Deck: FC<DeckProps> = ({ deck, onDrawCard }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const [shuffedCards, setShuffedCards] = useState<Card[]>([])

  const builtDeck = useMemo(() => {
    return buildDeck(deck)
  }, [deck])

  const handleClick = () => {
    onDrawCard(shuffedCards[currentCardIndex])

    if (currentCardIndex >= shuffedCards.length - 1) {
      setShuffedCards(builtDeck.cards.sort(() => Math.random() - 0.5))
      setCurrentCardIndex(0)
    } else {
      setCurrentCardIndex((prev) => prev + 1)
    }
  }

  useEffect(() => {
    setShuffedCards(builtDeck.cards.sort(() => Math.random() - 0.5))
  }, [])

  return (
    <div
      onClick={handleClick}
      className="deck flex cursor-pointer items-center justify-center rounded-lg border-2 border-white p-2 text-center text-white"
      style={{ backgroundColor: deck.color }}
    >
      {deck.type}
    </div>
  )
}

export default Deck
