/*jshint esversion: 6 */

import { validate } from '../../../lib/utils/answer-validator'

test("exact matches", () => {
  const answer = "three futures - torres"
  const match = {
    name: "Three Futures",
    artist: "Torres"
  }

  const result = validate(answer, match)  
})
