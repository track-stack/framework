/*jshint esversion: 6 */

import Player from './player'
import Turn from './turn'

interface GamePlayers {
  viewer: Player
  opponent: Player
}

export default class Game {
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
