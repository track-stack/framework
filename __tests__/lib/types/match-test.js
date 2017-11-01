/*jshint esversion: 6 */

import { Match } from '../../../lib/types'

test("initializes an instance from json", () => {
  const json = {
    name: "The Sweater Song",
    artist: "Weezer",
    image: "https://image.png"
  }

  const match = Match.from(json)  

  expect(match.name).toEqual(json.name)
  expect(match.artist).toEqual(json.artist)
  expect(match.image).toEqual(json.image)
})
