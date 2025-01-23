import React, { FC } from 'react'
import Modal from './Modal'
import { Card, DeckType, ItemCard, MarioPartyPlayer } from '../_types/types'
import CardDisplay from './CardDisplay'
import {
  addItemToPlayer,
  useGameDispatch,
} from '../_contexts/MarioPartyContext'
import PlayerSelectButtons from './PlayerSelectButtons'

interface CardModalProps {
  open: boolean
  selectedCard: Card | null
  onClose: () => void
}
const CardModal: FC<CardModalProps> = ({ open, selectedCard, onClose }) => {
  const dispatch = useGameDispatch()

  const onGivePlayerItem = (player: MarioPartyPlayer, item: ItemCard) => {
    dispatch(addItemToPlayer(player.id, item))
    onClose()
  }

  const handlePlayerClick = (player: MarioPartyPlayer) => {
    if (selectedCard?.type === DeckType.ITEM) {
      onGivePlayerItem(player, selectedCard as ItemCard)
    }
  }

  const CardAction = () => {
    return (
      <div className="flex items-center justify-center space-x-3">
        {selectedCard?.type === DeckType.ITEM && (
          <PlayerSelectButtons onPlayerClick={handlePlayerClick} />
        )}
      </div>
    )
  }

  return (
    <Modal open={open} handleClose={onClose} actions={<CardAction />}>
      {selectedCard && (
        <CardDisplay card={selectedCard} size="large" variant="dark" />
      )}
    </Modal>
  )
}

export default CardModal
