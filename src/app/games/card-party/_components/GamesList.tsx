import {
  MiniGameRequirements,
  MiniGameType,
  getMiniGameByTitle,
  getRequirementIcon,
  partyCards,
} from '@/data/party-cards'
import React, { FC } from 'react'

interface GamesListProps {
  cardList: { [key: string]: boolean }
  onSetCardList: (cardList: { [key: string]: boolean }) => void
}

const GamesList: FC<GamesListProps> = ({ cardList, onSetCardList }) => {
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

  const getGamesList = () => {
    const gamesByRequirement = Object.keys(cardList).reduce(
      (acc, key) => {
        const miniGame = getMiniGameByTitle(key as MiniGameType)
        if (miniGame === undefined) {
          return acc
        }

        // merge requirements into one string
        const requirement = miniGame.requirements?.join('-')

        if (requirement) {
          if (!acc[requirement]) {
            acc[requirement] = []
          }

          acc[requirement].push(miniGame)
        } else {
          if (!acc['none']) {
            acc['none'] = []
          }

          acc['none'].push(miniGame)
        }

        return acc
      },
      {} as { [key: string]: typeof partyCards }
    )

    // sort by mini game title
    Object.entries(gamesByRequirement).forEach((entries) => {
      entries[1].sort((a, b) => {
        if (a.title < b.title) {
          return -1
        }

        if (a.title > b.title) {
          return 1
        }

        return 0
      })
    })

    return Object.entries(gamesByRequirement).map(
      ([requirement, miniGames]) => (
        <div key={requirement}>
          <hr className="border-gray-400" />
          {miniGames.map((miniGame) => (
            <div
              key={miniGame.title}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                {miniGame.title}
                <em className="ml-2 text-sm text-gray-500">
                  {miniGame.isBeta && 'beta'}
                </em>
              </div>

              <div className="flex items-center">
                <div className="flex h-full items-center px-4">
                  {miniGame.requirements?.map((line, index) => (
                    <div
                      key={index}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-lg"
                    >
                      {getRequirementIconComponent({ requirement: line })}
                    </div>
                  ))}
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="mini-game"
                    checked={cardList[miniGame.title]}
                    className="mr-2"
                    onChange={() => {
                      onSetCardList({
                        ...cardList,
                        [miniGame.title]: !cardList[miniGame.title],
                      })
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )
    )
  }

  return getGamesList()
}

export default GamesList
