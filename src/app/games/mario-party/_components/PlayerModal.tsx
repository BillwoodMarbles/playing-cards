import React, { FC, useMemo } from 'react'
import Modal from './Modal'
import { ItemCard, MarioPartyPlayer } from '../_types/types'
import CardDisplay from './CardDisplay'
import UseItemModal from './UseItemModal'
import {
  updatePlayerCoins,
  updatePlayerStars,
  useGameDispatch,
  useGameState,
} from '../_contexts/MarioPartyContext'
import { PiCoinVertical, PiStar } from 'react-icons/pi'
import PlayerToken from './PlayerToken'

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
  const { players } = useGameState()
  const dispatch = useGameDispatch()

  const player = useMemo(() => {
    return players.find((p) => p.id === selectedPlayer?.id)
  }, [players, selectedPlayer])

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

  const addCoins = (amount: number) => {
    if (!player) return

    if (amount < 0 && player.coins + amount < 0) {
      dispatch(updatePlayerCoins(player.id, -player.coins)) // Subtract only the player's current coins
    } else {
      dispatch(updatePlayerCoins(player.id, amount)) // Add or subtract the full amount
    }
  }

  const updateStars = (amount: number) => {
    if (!player) return

    if (amount < 0 && player.stars + amount < 0) {
      dispatch(updatePlayerStars(player.id, -player.stars))
    } else {
      dispatch(updatePlayerStars(player.id, amount))
    }
  }

  if (!selectedPlayer) {
    return null
  }

  return (
    <>
      <Modal open={open} handleClose={setOpen}>
        <div className="flex w-full items-center justify-center">
          {player && (
            <div className="flex flex-col items-center justify-center text-center ">
              <PlayerToken player={player} />

              <div className="mb-2 mt-4 flex items-center justify-center space-x-1 border-b border-slate-300 p-2">
                <button
                  className="h-10 w-10 rounded-full border-2 border-red-600 bg-red-400"
                  onClick={() => addCoins(-10)}
                >
                  -10
                </button>
                <button
                  className="h-10 w-10 rounded-full border-2 border-red-600 bg-red-400"
                  onClick={() => addCoins(-5)}
                >
                  -5
                </button>
                <button
                  className="h-10 w-10 rounded-full border-2 border-red-600 bg-red-400"
                  onClick={() => addCoins(-1)}
                >
                  -1
                </button>
                <div className="mx-1 flex h-8 w-16 items-center justify-center whitespace-nowrap rounded-full border-2 border-white bg-slate-50">
                  <PiCoinVertical size={24} />: {player.coins}
                </div>
                <button
                  className="h-10 w-10 rounded-full border-2 border-green-600 bg-green-400"
                  onClick={() => addCoins(1)}
                >
                  +1
                </button>
                <button
                  className="h-10 w-10 rounded-full border-2 border-green-600 bg-green-400"
                  onClick={() => addCoins(5)}
                >
                  +5
                </button>

                <button
                  className="h-10 w-10 rounded-full border-2 border-green-600 bg-green-400"
                  onClick={() => addCoins(10)}
                >
                  +10
                </button>
              </div>

              <div className="mb-4 flex items-center justify-center space-x-1 p-2">
                <button
                  className="h-10 w-10 rounded-full border-2 border-red-600 bg-red-400"
                  onClick={() => updateStars(-1)}
                >
                  -1
                </button>
                <div className="mx-1 flex h-8 w-16 items-center justify-center whitespace-nowrap rounded-full border-2 border-white bg-slate-50">
                  <PiStar size={24} />: {player.stars}
                </div>
                <button
                  className="h-10 w-10 rounded-full border-2 border-green-600 bg-green-400"
                  onClick={() => updateStars(1)}
                >
                  +1
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3">
                {player.items.map((item) => (
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
          player={player}
          onClose={handleItemModalClose}
          item={selectedItem}
        />
      )}
    </>
  )
}

export default PlayerModal
