/*jshint esversion: 6 */

import { validate } from '../../../lib/utils/answer-validator'

test("exact matches", () => {
  const answer = "three futures - torres"
  const match = {
    name: "Three Futures",
    artist: "Torres"
  }

  const result = validate(answer, "", match)  

  expect(result.confidence).toBe(100.0)
  expect(result.exactArtistMatch).toBe(true)
  expect(result.exactNameMatch).toBe(true)
})

// not exact match
test("artist name is exact match as substring", () => {
  const answer = "First Date by Blink-182"
  const match = {
    name: "First Date",
    artist: "Blink 182 (By Victor BOI)"
  }

  const result = validate(answer, "", match)  

  expect(result.exactNameMatch).toBe(true)
  expect(result.exactArtistMatch).toBe(true)
})
