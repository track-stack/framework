/*jshint esversion: 6 */

import { Stack } from '../../../lib/types'
import { generate } from '../../generator'

test("initializes an instance from json", () => {
  const json = generate("Turn", true)
  const stack = Stack.from({turns: [json]})
  expect(stack.turns.length).toBe(1)
})

// #latestTurn
test("returns the last turn", () => {
  const turns = [
    generate("Turn", true),
    generate("Turn", true)
  ]
  const stack = Stack.from({turns: turns})

  const latestTurn = turns[turns.length - 1]
  expect(stack.lastTurn().name).toBe(latestTurn.name)
})

// #firstTurun
test("returns the first turn", () => {
  const turns = [
    generate("Turn", true),
    generate("Turn", true)
  ]

  const stack = Stack.from({turns: turns})

  const firstTurn = turns[0]
  expect(stack.firstTurn().name).toBe(firstTurn.name)
})