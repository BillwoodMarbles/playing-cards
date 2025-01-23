import React, { useState } from 'react'
import ActionModal from './ActionModal'
import { Action } from '../_types/types'
import { actions } from '../_data/actions'
import BoardSpace from './BoardSpace'
import { FaExclamation } from 'react-icons/fa'

const ActionsSection = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<Action | null>(null)

  const handleOpenModal = (action: Action) => {
    setSelectedAction(action)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedAction(null)
    setModalOpen(false)
  }

  return (
    <section className="flex w-full flex-col justify-center rounded-2xl bg-white/25 p-2">
      <div className="mb-2 flex items-center justify-center rounded-2xl bg-white/25 p-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-50">
          <FaExclamation />
        </div>
        <div className="ml-2">Spaces</div>
      </div>

      <div className="grid grid-cols-6 place-items-center gap-4">
        {actions.map((action) => (
          <BoardSpace
            onClick={() => handleOpenModal(action)}
            key={action.name}
            action={action}
          ></BoardSpace>
        ))}
      </div>

      <ActionModal
        open={modalOpen}
        onClose={handleCloseModal}
        action={selectedAction}
      />
    </section>
  )
}

export default ActionsSection
