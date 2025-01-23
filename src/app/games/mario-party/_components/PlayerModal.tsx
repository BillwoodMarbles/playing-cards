import React, { FC } from 'react'
import Modal from './Modal'
import { ItemCard, MarioPartyPlayer } from '../_types/types'
import CardDisplay from './CardDisplay'
import UseItemModal from './UseItemModal'

interface PlayerModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onClose: () => void
  selectedPlayer?: MarioPartyPlayer | null
}

const PlayerModal: FC<PlayerModalProps> = ({
  open,
  selectedPlayer,
  setOpen,
  onClose,
}) => {
  const [useItemModalOpen, setUseItemModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ItemCard | null>(null)

  const handleItemSelect = (item: ItemCard) => {
    setSelectedItem(item)
    setUseItemModalOpen(true)
  }

  const handleItemModalClose = (closeParent?: boolean) => {
    setSelectedItem(null)
    setUseItemModalOpen(false)

    if (closeParent) {
      onClose()
    }
  }

  if (!selectedPlayer) {
    return null
  }

  return (
    <>
      <Modal open={open} handleClose={setOpen}>
        <div className="flex w-full items-center justify-center">
          {selectedPlayer && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-white p-2 text-center ">
              <header>{selectedPlayer.character}</header>
              <div>
                C: {selectedPlayer.coins} | S: {selectedPlayer.stars}
              </div>

              <div className="mt-4 flex items-center justify-center space-x-3">
                {selectedPlayer.items.map((item) => (
                  <div key={item.name} onClick={() => handleItemSelect(item)}>
                    <CardDisplay card={item} size="small" variant="dark" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {selectedItem && (
        <UseItemModal
          open={useItemModalOpen}
          player={selectedPlayer}
          onClose={handleItemModalClose}
          item={selectedItem}
        />
      )}
    </>
  )
}

export default PlayerModal
