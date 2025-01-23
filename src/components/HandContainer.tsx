import React, { FC } from 'react'

interface HandContainerProps {
  children?: React.ReactNode
}

const HandContainer: FC<HandContainerProps> = ({ children }) => {
  return (
    <div className="px-6">
      <div className="flex w-full flex-wrap justify-center py-4 pb-16 pr-12">
        {children}
      </div>
    </div>
  )
}

export default HandContainer
