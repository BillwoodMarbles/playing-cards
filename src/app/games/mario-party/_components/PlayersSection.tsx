import React, { FC, useState } from 'react'
import { ItemCard, MarioPartyPlayer } from '../_types/types'
import { PiPerson } from 'react-icons/pi'
import PlayerModal from './PlayerModal'
import { useGameState } from '../_contexts/MarioPartyContext'

interface PlayersProps {}
const PlayersSection: FC<PlayersProps> = () => {
  const { players } = useGameState()

  const [selectedPlayer, setSelectedPlayer] = useState<MarioPartyPlayer | null>(
    null
  )
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = (player?: MarioPartyPlayer) => {
    setSelectedPlayer(player || null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedPlayer(null)
    setModalOpen(false)
  }

  const getItemIconComponent = (item: ItemCard) => {
    const Icon = item?.icon

    if (Icon) {
      return <Icon size={20} />
    }
    return <>-</>
  }

  return (
    <section className="flex w-full flex-col justify-center rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <PiPerson />
        </div>
        <div className="ml-2">Players</div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-around gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="relative flex flex-col items-center justify-center"
          >
            <div
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-white p-2 text-center text-white"
              style={{ backgroundColor: player.color }}
              onClick={() => handleOpenModal(player)}
            ></div>
            <div className="mb-1">{player.character}</div>

            <div className="mb-1 flex items-center justify-center">
              <div className="mx-1 flex h-8 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-50">
                C: {player.coins}
              </div>

              <div className="mx-1 flex h-8 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-50">
                S: {player.stars}
              </div>
            </div>

            <div className="flex items-center justify-center">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="mx-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-50"
                >
                  {getItemIconComponent(player?.items?.[i] as ItemCard)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <PlayerModal
        open={modalOpen}
        setOpen={setModalOpen}
        selectedPlayer={selectedPlayer}
        onClose={handleCloseModal}
      />
    </section>
  )
}

export default PlayersSection
