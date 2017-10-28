/*jshint esversion: 6 */

export default class Match {
  name: string
  artist: string
  image: string

  constructor(name: string, artist: string, image: string) {
    this.name = name
    this.artist = artist
    this.image = image
  }

  static from(json: any): Match {
    return new Match(json.name, json.artist, json.image)
  }
}
