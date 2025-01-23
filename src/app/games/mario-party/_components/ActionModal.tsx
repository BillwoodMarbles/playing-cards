import React, { FC } from 'react'
import { Action } from '../_types/types'
import Modal from './Modal'

interface ActionModalProps {
  open: boolean
  action: Action | null
  onClose: () => void
}
const ActionModal: FC<ActionModalProps> = ({ open, action, onClose }) => {
  const ActionComponent = action?.component

  return (
    <Modal open={open} handleClose={onClose}>
      <div className="flex items-center justify-center space-x-3 py-2">
        <h3 className="text-lg">{action?.name}</h3>
      </div>

      <div className="text-center">
        {action?.description && <div>{action?.description}</div>}
      </div>

      {ActionComponent && (
        <div className="mt-4">
          <ActionComponent />
        </div>
      )}
    </Modal>
  )
}

export default ActionModal
