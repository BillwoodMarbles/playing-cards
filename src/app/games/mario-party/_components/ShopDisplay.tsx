import {
  addItemToShop,
  useGameDispatch,
  useGameState,
} from '@/app/games/mario-party/_contexts/MarioPartyContext'
import { ItemDeck } from '@/app/games/mario-party/_data/cards'
import { ItemCard } from '@/app/games/mario-party/_types/types'
import React, { FC, useEffect } from 'react'
import CardDisplay from './CardDisplay'
import UseItemModal from './UseItemModal'

const MAX_ITEMS = 3

interface ShopDisplayProps {}
const ShopDisplay: FC<ShopDisplayProps> = () => {
  const { shop } = useGameState()
  const dispatch = useGameDispatch()

  const [useItemModalOpen, setUseItemModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ItemCard | null>(null)

  const handleItemSelect = (item: ItemCard) => {
    setSelectedItem(item)
    setUseItemModalOpen(true)
  }

  const handleItemModalClose = () => {
    setSelectedItem(null)
    setUseItemModalOpen(false)
  }

  const fillShop = () => {
    const currentItems = shop.length

    if (currentItems >= MAX_ITEMS) return

    const itemsToAdd = MAX_ITEMS - currentItems
    for (let i = 0; i < itemsToAdd; i++) {
      const item: ItemCard = ItemDeck.cards[
        Math.floor(Math.random() * ItemDeck.cards.length)
      ] as ItemCard
      dispatch(addItemToShop(item))
    }
  }

  useEffect(() => {
    fillShop()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-white p-2 text-center ">
        <div className="flex items-center justify-center space-x-3">
          {shop?.map((item) => (
            <div key={item.name} onClick={() => handleItemSelect(item)}>
              <CardDisplay card={item} variant="dark" />
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <UseItemModal
          open={useItemModalOpen}
          onClose={handleItemModalClose}
          item={selectedItem}
        />
      )}
    </>
  )
}

export default ShopDisplay
