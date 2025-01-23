import { Game, Player } from '../types/types'

export const getPlayerById = (game: Game | null, playerId?: string) => {
  if (game === null || !playerId) return null
  return game.players.find((player) => player.id === playerId) || null
}

export const getPlayerIndexById = (game: Game | null, playerId: string) => {
  if (game === null || !playerId) return null
  return game.players.findIndex((player) => player.id === playerId)
}

export const sortPlayerCards = (game: Game | null, player: Player) => {
  let sortedCards = [...player.cards]

  const prevPlayerData = game?.players.find(
    (prevPlayer) => prevPlayer.id === player.id
  )
  const sortingArr = prevPlayerData?.cards.map((card) => card.id)

  if (sortingArr) {
    sortedCards = sortedCards.sort(function (a, b) {
      const indexA = sortingArr.indexOf(a.id)
      const indexB = sortingArr.indexOf(b.id)

      if (indexA === -1) return 1 // a is not found, sort it to the end
      if (indexB === -1) return -1 // b is not found, sort it to the end

      return indexA - indexB // both are found, sort them based on their indices
    })
  }

  return sortedCards
}
