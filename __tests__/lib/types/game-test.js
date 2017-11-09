/*jshint esversion: 6 */

import { Game } from '../../../lib/types'

test("initializes an instance from json", () => {
  const json = {
    id: 20, 
    players: { 
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    rounds: []
  }

  const game = Game.from(json)

  expect(game.id).toEqual(20)
  expect(game.rounds.length).toBe(0)
  expect(game.status).toEqual(1)
  expect(game.players).toEqual(json.players)
});
