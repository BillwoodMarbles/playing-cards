'use client'

import React from 'react'

import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'
import { GameTypes } from '@/data/game-configs'
import Link from 'next/link'

Amplify.configure(amplifyconfig)

export default function Home() {
  const games = [
    {
      name: 'Three Thirteen',
      type: GameTypes.GRANDMA,
      color: 'red',
      path: '/three-thirteen',
    },
    {
      name: 'Mini Golf',
      type: GameTypes.MINI_GOLF,
      color: 'green',
      path: '/mini-golf',
    },
    {
      name: 'Card Party',
      type: GameTypes.CARD_PARTY,
      color: 'purple',
      path: '/card-party',
    },
  ]

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-300'
      case 'green':
        return 'bg-emerald-300'
      case 'purple':
        return 'bg-purple-300'
      default:
        return 'bg-blue-300'
    }
  }

  return (
    <>
      <header className="flex w-full items-center justify-center py-2">
        <div className="flex items-center">
          <h1 className="text-2xl">Games Night</h1>
        </div>
      </header>

      <section className="w-full grow bg-slate-100 px-2 py-4 text-center">
        <div className="flex justify-center">
          {games.map(({ name, color, path }) => (
            <Link
              href={`/games/${path}`}
              key={name}
              className={`mx-2 flex h-36 w-36 items-center justify-center rounded-lg ${getBgColorClass(
                color
              )}`}
            >
              {name}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
