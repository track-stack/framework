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

test("returns false when no artist was submitted", () => {
  const answer = "stay together for the kids"
  const match = {
    name: "Stay Together for the Kids",
    artist: "blink-182"
  }

  const result = validate(answer, match)

  expect(result).toBe(false)
})

// #findSimilarity
test("with overlap", () => {
  const result = hasIntersection("Trap Queen", "Trapped")
  expect(result).toBe(true)
})

test("without overlap", () => {
  const result = hasIntersection("Happy Together", "Beautiful Boy")
  expect(result).toBe(false)
})
