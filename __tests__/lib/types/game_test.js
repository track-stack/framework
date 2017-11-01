/*jshint esversion: 6 */

import { Game } from '../../../lib/types'

test("initializes an instance from json", () => {
  const turn = {
    user_id: 1, 
    answer: "all the small things", 
    created_at: new Date(),
    distance: 0,
    has_exact_artist_match: false,
    has_exact_name_match: true,
    match: {
      name: "All the Small Things", 
      artist: "blink-182"
    },
    user_photo: "https://image.png"
  }

  const json = {
    id: 20, 
    players: { 
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    turns: [turn]
  }

  const game = new Game.from(json)

  expect(game.id).toEqual(20)
  expect(game.turns.length).toBe(1)
  expect(game.players).toEqual(json.players)
});
