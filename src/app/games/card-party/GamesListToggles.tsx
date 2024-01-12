import {
  MiniGameRequirements,
  getRequirementIcon,
  partyCards,
} from '@/app/data/party-cards'
import React, { FC, useState } from 'react'

interface GamesListTogglesProps {
  cardList: { [key: string]: boolean }
  onSetCardList: (cardList: { [key: string]: boolean }) => void
}

const GamesListToggles: FC<GamesListTogglesProps> = ({
  cardList,
  onSetCardList,
}) => {
  const [requirementToggles, setRequirementToggles] = useState<
    { requirement: MiniGameRequirements; toggled: boolean }[]
  >([
    { requirement: 'none', toggled: true },
    { requirement: 'dice', toggled: true },
    { requirement: 'cards', toggled: true },
    { requirement: 'coins', toggled: true },
    { requirement: 'shot-glass', toggled: true },
    { requirement: 'standing', toggled: true },
    { requirement: 'drinking', toggled: true },
    { requirement: 'drawing', toggled: true },
  ])

  const getRequirementIconComponent = (item: {
    requirement: MiniGameRequirements
    toggled?: boolean
  }) => {
    const IconComponent = getRequirementIcon(item.requirement)
    if (!IconComponent) {
      return null
    }
    return <IconComponent className={item.toggled ? 'text-white' : ''} />
  }

  const toggleAllGamesOfRequirement = (
    requirement: MiniGameRequirements,
    toggled: boolean
  ) => {
    const newCardList = { ...cardList }

    partyCards.forEach((card) => {
      if (requirement === 'none') {
        if (!card.requirements?.length) {
          newCardList[card.title] = toggled
        }
        return
      }

      if (card.requirements?.includes(requirement)) {
        newCardList[card.title] = toggled
      }
    })

    onSetCardList(newCardList)
  }

  return (
    <div className="flex items-center justify-between py-2">
      {requirementToggles.map((line, index) => {
        return (
          <div
            onClick={() => {
              setRequirementToggles(
                requirementToggles.map((item) => {
                  if (item.requirement === line.requirement) {
                    return {
                      ...item,
                      toggled: !item.toggled,
                    }
                  }

                  return item
                })
              )
              toggleAllGamesOfRequirement(line.requirement, !line.toggled)
            }}
            key={index}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 text-lg ${
              line.toggled ? 'border-sky-100 bg-sky-500 text-white' : ''
            }`}
          >
            {getRequirementIconComponent(line)}
          </div>
        )
      })}
    </div>
  )
}

export default GamesListToggles
