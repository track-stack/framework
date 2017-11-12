/*jshint esversion: 6 */

import { 
  validate, 
  findMatch,
  hasIntersection
} from '../../../lib/utils/answer-validator'

// #validate
test("exact matches", () => {
  const answer = "three futures - torres"
  const match = {
    name: "Three Futures",
    artist: "Torres"
  }

  const result = validate(answer, match)  
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
