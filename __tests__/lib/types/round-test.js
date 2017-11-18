/*jshint esversion: 6 */

import { Stack } from '../../../lib/types'

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

  const stack = Stack.from({turns: [json]})
  expect(stack.turns.length).toBe(1)
})