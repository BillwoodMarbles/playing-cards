import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { FC } from 'react'
import { PiXCircleDuotone } from 'react-icons/pi'

interface ModalProps {
  open: boolean
  handleClose: (open: boolean) => void
  actions?: React.ReactNode
  children: React.ReactNode
}
const Modal: FC<ModalProps> = ({ open, handleClose, children, actions }) => {
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <PiXCircleDuotone aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="flex w-full flex-col items-center justify-center bg-white p-6 sm:p-4">
              {children}
            </div>

            {actions && (
              <div className="flex justify-center bg-gray-50 p-6 sm:p-4">
                {actions}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default Modal
