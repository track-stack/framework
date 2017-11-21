/*jshint esversion: 6 */

import { 
  validate, 
  findMatch,
  hasIntersection
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

// #findSimilarity
test("with overlap", () => {
  const result = hasIntersection({name: "Trap Queen"}, {artist: "Trapped"})
  expect(result).toBe(true)
})

test("without overlap", () => {
  const result = hasIntersection({name: "Happy Together"}, {name: "Beautiful Boy"})
  expect(result).toBe(false)
})

test("with numbers", () => {
  const result = hasIntersection({name: "baby 182"}, {artist: "blink-182"})
  expect(result).toBe(true)
})

test("with abbreviations", () => {
  const result = hasIntersection({artist: "M.I.A"}, {artist: "N.W.A"})
  expect(result).toBe(true)
})

test("with abbreviations 2", () => {
  const result = hasIntersection({artist: "M.I.A"}, {artist: "I am them"})
  expect(result).toBe(true)
})