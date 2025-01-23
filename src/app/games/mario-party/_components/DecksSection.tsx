import React, { useState } from 'react'
import Deck from './CardDeck'
import {
  BowserDeck,
  DuelDeck,
  ItemDeck,
  MiniGameAllVSAllDeck,
  MiniGameOneVSAllDeck,
  MiniGameTeamDeck,
} from '../_data/cards'
import '../_styles/board.css'
import CardModal from './CardModal'
import { Card } from '../_types/types'
import { CgCardHearts } from 'react-icons/cg'

const decks = [
  { deck: MiniGameAllVSAllDeck, name: 'MiniGameAllVSAllDeck' },
  { deck: MiniGameTeamDeck, name: 'MiniGameTeamDeck' },
  { deck: MiniGameOneVSAllDeck, name: 'MiniGameOneVSAllDeck' },
  { deck: BowserDeck, name: 'BowserDeck' },
  { deck: ItemDeck, name: 'ItemDeck' },
  { deck: DuelDeck, name: 'DuelDeck' },
]

const DecksSection = () => {
  const [modalOpen, setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const handleDrawCard = (card: any) => {
    setSelectedCard(card)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }

  return (
    <section className="flex w-full grow flex-col rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <CgCardHearts />
        </div>
        <div className="ml-2">Decks</div>
      </div>

      <div className="flex w-full grow flex-wrap items-center justify-around gap-3">
        {decks.map(({ deck, name }) => (
          <Deck key={name} deck={deck} onDrawCard={handleDrawCard} />
        ))}
      </div>

      <CardModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedCard={selectedCard}
      />
    </section>
  )
}

export default DecksSection
