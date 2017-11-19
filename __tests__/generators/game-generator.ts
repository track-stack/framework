/*jshint esversion: 6 */

import * as faker from 'faker'
import { Game } from '../../lib/types'
import generateStack from './stack-generator'

export default function generateGame(json: boolean, options: {stackCount: number, turnCount: number}): any | Game {
  const stackCount = options.stackCount || 0
  const turnCount = options.turnCount || 0 

  let stacks = []
  for (let i = 0; i < options.stackCount; i++) {
    stacks.push(generateStack(true, {turnCount}))
  }

  const raw = {
    id: 20,
    players: {
      viewer: {id: 1, name: faker.name.findName(), image: "https://image.png"},
      opponent: {id: 2, name: faker.name.findName(), image: "https://image.png"}
    },
    status: 1,
    stacks: stacks
  }

  if (json) { return raw }
  return Game.from(json)
}
