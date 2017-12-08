/*jshint esversion: 6 */

import { 
  validate, 
  findMatch,
  matchHasIntersection 
} from '../../../lib/utils/turn-processor'

// #validate
test("returns true with an exact match", () => {
  const answer = "three futures - torres"
  const match = {
    name: "Three Futures",
    artist: "Torres"
  }

  const result = validate(answer, match)  

  expect(result).toBe(true)
})

test("returns true if the submitted artist is present in the match", () => {
  const answer = "three futures - torres"
  const match = {
    name: "Three Futures",
    artist: "Torres (featuring Pitbull)"
  }

  const result = validate(answer, match)  

  expect(result).toBe(true)
})

// #matchHasIntersection
test("with overlap", () => {
  const result = matchHasIntersection({name: "Trap Queen"}, {artist: "Trapped"})
  expect(result).toBe(true)
})

test("with encoded names", () => {
  let result = matchHasIntersection({artist: "Aerodynamic"}, {artist: "Aerosmith"})
  expect(result).toBe(true)

  result = matchHasIntersection({artist: "$ave"}, {name: "Jesus Saves, I Spend"})
  expect(result).toBe(true)

  result = matchHasIntersection({artist: "curt@!n$"}, {name: "closed curtains"})
  expect(result).toBe(true)
})

test("without overlap", () => {
  const result = matchHasIntersection({name: "Happy Together"}, {name: "Beautiful Boy"})
  expect(result).toBe(false)
})

test("with numbers", () => {
  const result = matchHasIntersection({name: "baby 182"}, {artist: "blink-182"})
  expect(result).toBe(true)
})

test("with abbreviations", () => {
  const result = matchHasIntersection({artist: "M.I.A"}, {artist: "N.W.A"})
  expect(result).toBe(true)
})

test("with abbreviations 2", () => {
  const result = matchHasIntersection({artist: "M.I.A"}, {artist: "I am them"})
  expect(result).toBe(true)
})