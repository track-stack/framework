/*jshint esversion: 6 */

import { Game } from '../../../lib/types'
import { generate } from '../../generator'

test("initializes an instance from json", () => {
  const json = generate("Game", true)
  const game = Game.from(json)

  expect(game.id).toEqual(20)
  expect(game.stacks.length).toBe(0)
  expect(game.status).toEqual(1)
  expect(game.players).toEqual(json.players)
});

// #latestStack
test("returns null if there are no stacks", () => {
  const json = generate("Game", true)
  const game = Game.from(json)

  expect(game.latestStack()).toBe(null)
})

// #latestTurn
test("returns null if there are no stacks", () => {
  const json = generate("Game", true)
  const game = Game.from(json)

  expect(game.latestTurn()).toBe(null)
})

test("returns null if there are no turns", () => {
  const json = generate("Game", true, {stackCount: 1})
  const game = Game.from(json)

  expect(game.latestTurn()).toBe(null)
})

test("returns the latest turn", () => {
  const json = generate("Game", true, {stackCount: 1, turnCount: 1})
  const game = Game.from(json)
  const latestTurn = game.latestTurn()

  expect(latestTurn).not.toBe(null)
  expect(latestTurn.answer).toBe(json.stacks[0].turns[0].answer)
})

