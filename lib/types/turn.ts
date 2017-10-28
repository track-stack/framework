/*jshint esversion: 6 */

import Match from './match'

export default class Turn {
  userId: number
  answer: string
  distance: number
  hasExactNameMatch: boolean
  hasExactArtistMatch: boolean
  userPhoto: string
  match: Match

  constructor(userId: number, answer: string, distance: number, hasExactNameMatch: boolean, hasExactArtistMatch: boolean, userPhoto: string, match: Match) {
    this.userId = userId
    this.answer = answer
    this.distance = distance
    this.hasExactNameMatch = hasExactNameMatch
    this.hasExactArtistMatch = hasExactArtistMatch
    this.userPhoto = userPhoto
    this.match = match
  }

  static from(json: any): Turn {
    const match = Match.from(json.match)
    return new Turn(
      json.user_id,
      json.answer,
      json.distance,
      json.has_exact_name_match,
      json.has_exact_artist_match,
      json.user_photo,
      match
    )
  }
}
