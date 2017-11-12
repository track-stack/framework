/*jshint esversion: 6 */

import Player from './player'
import Round from './round'
import Turn from './turn'

interface GamePlayers {
  viewer: Player
  opponent: Player
}

export default class Game {
  id: number
  players: GamePlayers
  status: number
  rounds: Round[]

  constructor(id: number, players: GamePlayers, status: number, rounds: Round[]) {
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

  latestTurn(): Turn {
    const round = this.latestRound()
    if (!round) { return null }
    if (!round.turns) { return null }
    if (round.turns.length == 0) { return null }

    return round.turns[round.turns.length - 1]
  }

  latestRound(): Round {
    if (!this.rounds) { return null }
    if (this.rounds.length === 0) { return null }

    return this.rounds[this.rounds.length - 1]
  }
}
