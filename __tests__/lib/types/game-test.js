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
    stacks: []
  }

  const game = Game.from(json)

  expect(game.id).toEqual(20)
  expect(game.stacks.length).toBe(0)
  expect(game.status).toEqual(1)
  expect(game.players).toEqual(json.players)
});

// #latestStack
test("returns null if there are no stacks", () => {
  const json = {
    id: 20,
    players: {
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    stacks: []
  }

  const game = Game.from(json)

  expect(game.latestStack()).toBe(null)
})

// #latestTurn
test("returns null if there are no stacks", () => {
  const json = {
    id: 20,
    players: {
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    stacks: []
  }

  const game = Game.from(json)

  expect(game.latestTurn()).toBe(null)
})

test("returns null if there are no turns", () => {
  const json = {
    id: 20,
    players: {
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    stacks: [{turns: []}]
  }

  const game = Game.from(json)

  expect(game.latestTurn()).toBe(null)
})

test("returns the latest turn", () => {
  const json = {
    id: 20,
    players: {
      viewer: {id: 1, name: "Mike", image: "https://image.png"},
      opponent: {id: 2, name: "Meagan", image: "https://image.png"}
    },
    status: 1,
    stacks: [{turns: [
      {
        answer: "three futures - torres",
        created_at: "2017-11-11T16:37:26.591Z",
        has_exact_artist_match : true,
        has_exact_name_match : true,
        match : {name: "Three Futures", artist: "Torres", image: "https://image.png"},
        user_id : 1,
        user_photo : "http://graph.facebook.com/v2.6/101441640615588/picture?type=large"
      }
    ]}]
  }

  const game = Game.from(json)
  const latestTurn = game.latestTurn()

  expect(latestTurn).not.toBe(null)
  expect(latestTurn.answer).toBe("three futures - torres")
})

