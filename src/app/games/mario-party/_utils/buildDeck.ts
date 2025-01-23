import { Card, CardDeck } from '../_types/types'

export const buildDeck = (deck: CardDeck): CardDeck => {
  const newCards: Card[] = []

  deck.cards.forEach((card) => {
    const count = deck?.config?.[card.name] || 1 // Default to 1 if not specified

    for (let i = 0; i < count; i++) {
      newCards.push({ ...card })
    }
  })

  // sort by name
  const sortedCards = [...newCards].sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  console.log(`build deck ${deck.type}`, [...sortedCards])

  return {
    ...deck,
    cards: sortedCards,
  }
}
