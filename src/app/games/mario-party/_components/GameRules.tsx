import React from 'react'
import {
  BowserCards,
  BowserDeck,
  DuelDeck,
  ItemCards,
  ItemDeck,
  MiniGameAllVSAllDeck,
  MiniGameOneVSAllDeck,
  MiniGamesAllVSALL,
  MiniGamesDuel,
  MiniGamesOneVSAll,
  MiniGamesTeams,
  MiniGameTeamDeck,
} from '../_data/cards'
import { buildDeck } from '../_utils/buildDeck'
import {
  ActionSpaceType,
  Card,
  CardDeck,
  ItemCard,
  MiniGameCard,
} from '../_types/types'
import { actions } from '../_data/actions'
import BoardSpace from './BoardSpace'

const GameRules = () => {
  const miniGameAllVSAllDeck = buildDeck(MiniGameAllVSAllDeck)
  const miniGameTeamDeck = buildDeck(MiniGameTeamDeck)
  const miniGameOneVSAllDeck = buildDeck(MiniGameOneVSAllDeck)
  const bowserDeck = buildDeck(BowserDeck)
  const itemDeck = buildDeck(ItemDeck)
  const duelDeck = buildDeck(DuelDeck)

  const getIconComponent = (item: Card) => {
    const IconComponent = item.icon
    if (!IconComponent) {
      return null
    }
    return <IconComponent size={14} />
  }

  const orderCardsByName = (
    cards: Card[] | ItemCard[] | MiniGameCard[]
  ): Card[] => {
    return cards.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    }) as ItemCard[]
  }

  const getCardCountInDeck = (deck: CardDeck, card: Card) => {
    return deck.cards.filter((c) => c.name === card.name).length
  }

  return (
    <section className="w-full">
      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Sumary</h4>
        </div>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Included Items</h4>
        </div>

        <ul className="m-0 p-0">
          <li>1 Game Board</li>
          <li>6 Player Pawns</li>
          <li>6 Player Coins</li>
          <li>1 Star Pawn</li>
          <li>1 Bowser Pawn</li>
          <li>1 Turn Counter Token</li>

          <li className="text-slate-400">------</li>

          <li>1 Movement Die (1-6)</li>
          <li>1 Player Die</li>
          <li>1 Chance Time Die</li>

          <li className="text-slate-400">------</li>

          <li>
            {miniGameAllVSAllDeck.cards.length} {miniGameAllVSAllDeck.type}{' '}
            Cards
          </li>
          <li>
            {miniGameTeamDeck.cards.length} {miniGameTeamDeck.type} Cards
          </li>
          <li>
            {miniGameOneVSAllDeck.cards.length} {miniGameOneVSAllDeck.type}{' '}
            Cards
          </li>
          <li>
            {bowserDeck.cards.length} {bowserDeck.type} Cards
          </li>
          <li>
            {itemDeck.cards.length} {itemDeck.type} Cards
          </li>
          <li>
            {duelDeck.cards.length} {duelDeck.type} Cards
          </li>

          <li className="text-slate-400">------</li>

          <li>1 Lucky Card</li>
          <li>1 Chance Time Card</li>
          <li>1 Shop Card</li>

          <li className="text-slate-400">------</li>

          <li>25 Stars</li>
          <li>25 1 Coins</li>
          <li>25 5 Coins</li>
          <li>25 10 Coins</li>
        </ul>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Setup</h4>
        </div>

        <div>
          <ul className="list-inside list-disc">
            <li>
              Each player selects a pawn and places it on the starting space
            </li>
            <li>Give each player their associated player token</li>
            <li>Give each player 10 coins to start the game.</li>
            <li>
              Choose the number of turns you want to play between 10, 15, and 20
            </li>
            <li>
              Each player rolls the movement die to determine who goes first
              (highest number wins)
            </li>
          </ul>
        </div>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Gameplay</h4>
        </div>

        <div>
          <ul className="list-inside list-disc"></ul>
        </div>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Spaces</h4>
        </div>

        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Space
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <BoardSpace
                      action={action}
                      onClick={() => {}}
                      variant={
                        action.type === ActionSpaceType.PASS ? 'dark' : 'base'
                      }
                    />
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{action.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {action.description}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Item Cards</h4>
        </div>

        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"></th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Shop Cost
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-right align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Card Count
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(ItemCards).map((item) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.description}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.shopCost}
                  </td>
                  <td className="border-b border-slate-100 p-2 text-right align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getCardCountInDeck(itemDeck, item)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Bowser Cards</h4>
        </div>

        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              {/* <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Icon
              </th> */}
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-right align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Card Count
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(BowserCards).map((item) => (
              <>
                <tr>
                  {/* <td className="border-b border-slate-100 p-2 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td> */}
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.description}
                  </td>
                  <td className="border-b border-slate-100 p-2 text-right align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getCardCountInDeck(bowserDeck, item)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </article>

      <article className="mb-10">
        <div className="mb-2 border-b border-b-slate-300 pb-2">
          <h4 className="font-semibold">Mini Games</h4>
        </div>

        <div className="mb-2">
          <h5 className="text-sm font-semibold">All vs All</h5>
        </div>

        <table className="mb-8 w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"></th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(MiniGamesAllVSALL).map((item) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.fullDescription?.map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                        <br />
                      </p>
                    ))}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <div className="mb-2">
          <h5 className="text-sm font-semibold">One vs All</h5>
        </div>

        <table className="mb-8 w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"></th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(MiniGamesOneVSAll).map((item) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.fullDescription?.map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                        <br />
                      </p>
                    ))}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <div className="mb-2">
          <h5 className="text-sm font-semibold">Teams</h5>
        </div>

        <table className="mb-8 w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"></th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(MiniGamesTeams).map((item) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.fullDescription?.map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                        <br />
                      </p>
                    ))}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <div className="mb-2">
          <h5 className="text-sm font-semibold">Duel</h5>
        </div>

        <table className="mb-8 w-full table-auto text-left">
          <thead>
            <tr>
              <th className="border-b p-2 pb-3 pt-0 text-left text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"></th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Name
              </th>
              <th className="border-b p-2 pb-3 pt-0 text-left align-bottom text-sm font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {orderCardsByName(MiniGamesDuel).map((item) => (
              <>
                <tr>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {getIconComponent(item)}
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="border-b border-slate-100 p-2 align-top text-sm text-slate-800 dark:border-slate-700 dark:text-slate-400">
                    {item.fullDescription?.map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                        <br />
                      </p>
                    ))}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  )
}

export default GameRules
