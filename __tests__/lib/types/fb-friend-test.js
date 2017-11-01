/*jshint esversion: 6 */

import { FBFriend } from '../../../lib/types'

test("initializes an instance from json", () => {
  const json = {
    id: "12093812093",
    name: "Baby Driver",
    picture: {
      data: {
        url: "https://image.png"
      }
    }
  }

  const friend = FBFriend.from(json)

  expect(friend.id).toEqual(json.id)
  expect(friend.name).toEqual(json.name)
  expect(friend.picture).toEqual(json.picture)
})
