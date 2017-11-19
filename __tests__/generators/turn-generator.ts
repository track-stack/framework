/*jshint esversion: 6 */

import * as faker from 'faker'
import { Turn } from '../../lib/types'

export default function generateTurn(json: boolean): any | Turn {
  const name = faker.lorem.words(3)
  const artist = faker.name.findName()
  const raw = {
    user_id: 1, 
    answer: name.toLowerCase(),
    created_at: new Date(),
    distance: 0,
    has_exact_artist_match: false,
    has_exact_name_match: true,
    match: {
      name: name, 
      artist: artist 
    },
    user_photo: "https://image.png"
  }

  if (json) { return raw } 
  return Turn.from(raw)
}