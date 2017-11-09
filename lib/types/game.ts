/*jshint esversion: 6 */

import Player from './player'
import Round from './round'

interface GamePlayers {
  viewer: Player
  opponent: Player
}

export default class Game {
  id: number
  players: GamePlayers
  status: number
  rounds: [Round]

  constructor(id: number, players: GamePlayers, status: number, rounds: [Round]) {
     this.id = id
     this.players = players
     this.status = status
     this.rounds = rounds
  }

  static from(json: any): Game {
    const rounds = json.rounds.map(round => Round.from(round))
    const players: GamePlayers = {
      viewer: json.players.viewer,
      opponent: json.players.opponent
    }
    return new Game(json.id, players, json.status, rounds)
  }
}
