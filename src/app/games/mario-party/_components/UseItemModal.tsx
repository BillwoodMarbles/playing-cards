import React, { FC } from 'react'
import { ItemCard, MarioPartyPlayer } from '../_types/types'
import Modal from './Modal'
import CardDisplay from './CardDisplay'
import PlayerSelectButtons from './PlayerSelectButtons'
import {
  addItemToPlayer,
  removeItemFromShop,
  useGameDispatch,
  useItem,
} from '../_contexts/MarioPartyContext'

interface UseItemModalProps {
  open: boolean
  player?: MarioPartyPlayer
  item: ItemCard
  onClose: (closeParent?: boolean) => void
}
const UseItemModal: FC<UseItemModalProps> = ({
  open,
  player,
  item,
  onClose,
}) => {
  const dispatch = useGameDispatch()

  const onPlayerClick = (selectedPlayer: MarioPartyPlayer) => {
    if (player) {
      dispatch(useItem(player.id, item))
    } else {
      dispatch(removeItemFromShop(item))
    }
    dispatch(addItemToPlayer(selectedPlayer.id, item))
    onClose(true)
  }

  const handleUseItem = () => {
    if (!player) return
    dispatch(useItem(player.id, item))
    onClose(true)
  }

  return (
    <Modal
      open={open}
      handleClose={onClose}
      actions={
        <>
          <div>
            {player && (
              <div className="mb-2 flex items-center justify-center">
                <button
                  className="min-w-32 rounded-full border border-blue-600 bg-blue-200 p-4"
                  onClick={handleUseItem}
                >
                  Use Item
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-col items-center justify-center">
              <h3 className="mb-2">Give to</h3>
              <PlayerSelectButtons onPlayerClick={onPlayerClick} />
            </div>
          </div>
        </>
      }
    >
      <CardDisplay card={item} size="large" variant="dark" />
    </Modal>
  )
}

export default UseItemModal
