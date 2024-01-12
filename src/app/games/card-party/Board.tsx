import Header from '@/app/components/Header'
import { useGameContext } from '@/app/contexts/GameContext'
import { MiniGameType, partyCards } from '@/app/data/party-cards'
import React, { FC, useState } from 'react'
import GamesList from './GamesList'
import GamesListToggles from './GamesListToggles'
import StartGameCTA from './StartGameCTA'
import BurnCardCTA from './BurnCardCTA'
import MiniGameDeck from './MiniGameDeck'

const PartyBoard: FC = () => {
  const { game } = useGameContext()

  const [cardList, setCardList] = useState<{ [key in MiniGameType]?: boolean }>(
    () => {
      const cardList: { [key in MiniGameType]?: boolean } = {}

      partyCards.forEach((card) => {
        cardList[card.title] = true
      })

      return cardList
    }
  )

  const getCountOfAllToggledGames = () => {
    return Object.values(cardList).filter((item) => item).length
  }

  const showBurnCardCTA = () => {
    const topCard = game.deck[game.deck.length - 1]
    return topCard?.status === 'visible'
  }

  const showStartGameCTA = () => {
    return game.status === 'open' && getCountOfAllToggledGames() > 0
  }

  return (
    <>
      <Header />

      {game.status === 'open' && (
        <div className="w-full px-4 py-6 pb-14">
          <h2 className="text-lg font-bold">
            Games List ({getCountOfAllToggledGames()})
          </h2>

          <GamesListToggles cardList={cardList} onSetCardList={setCardList} />
          <GamesList cardList={cardList} onSetCardList={setCardList} />
        </div>
      )}

      {game.status === 'in-progress' && (
        <div className="relative flex w-full grow flex-col items-center justify-center overflow-x-hidden bg-slate-100 px-4 py-6">
          <div className="mb-6 flex w-full  flex-col justify-center ">
            <MiniGameDeck />
          </div>
        </div>
      )}

      <div className="relative z-20 w-full grow-0 bg-slate-100 pb-4">
        <div className="fixed bottom-0 left-0 flex w-full justify-center border-t-2 bg-white py-3">
          {showStartGameCTA() && <StartGameCTA cardList={cardList} />}
          {showBurnCardCTA() && <BurnCardCTA />}
        </div>
      </div>
    </>
  )
}

export default PartyBoard
