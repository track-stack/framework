/*jshint esversion: 6 */

import { Turn, Match } from '../../../lib/types'

test("initializes an instance from json", () => {
  const json = {
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

  const turn = Turn.from(json)

  expect(turn.userId).toEqual(1)
  expect(turn.answer).toEqual("all the small things")
  expect(turn.distance).toEqual(0)
  expect(turn.hasExactArtistMatch).toEqual(false)
  expect(turn.hasExactNameMatch).toEqual(true)
  expect(turn.userPhoto).toEqual("https://image.png")
  expect(turn.match).not.toBeNull()
})