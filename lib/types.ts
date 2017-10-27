class Player {
  id: number
  name: string
  image: string
}

class Match {
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

class Turn {
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

interface GamePlayers {
  viewer: Player
  opponent: Player
}

export class Game {
  id: number
  players: GamePlayers
  status: number
  turns: [Turn]

  constructor(id: number, players: GamePlayers, status: number, turns: [Turn]) {
     this.id = id
     this.players = players
     this.status = status
     this.turns = turns
  }

  static from(json: any): Game {
    const turns = json.turns.map(turn => {
       return Turn.from(turn)
    })
    const players: GamePlayers = {
      viewer: json.players.viewer, 
      opponent: json.players.opponent
    }
    return new Game(json.id, players, json.status, turns)
  }
}
