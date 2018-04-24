/*jshint esversion: 6 */

import Player from './player'
import Stack from './stack'
import Turn from './turn'

interface GamePlayers {
  viewer: Player
  opponent: Player
}

export default class Game {
  id: number
  players: GamePlayers
  status: number
  stacks: Stack[]
  viewersTurn: boolean

  constructor(id: number, players: GamePlayers, status: number, stacks: Stack[], viewersTurn: boolean) {
     this.id = id
     this.players = players
     this.status = status
     this.stacks = stacks
     this.viewersTurn = viewersTurn
  }

  static from(json: any): Game {
    const stacks = json.stacks.map(stack => Stack.from(stack))
    const players: GamePlayers = {
      viewer: json.players.viewer,
      opponent: json.players.opponent
    }
    return new Game(json.id, players, json.status, stacks, json.viewers_turn)
  }

  latestTurn(): Turn {
    const stack = this.latestStack()
    if (!stack) { return null }
    if (!stack.turns) { return null }
    if (stack.turns.length == 0) { return null }

    return stack.latestTurn()
  }

  firstTurn(): Turn {
    const stack = this.latestStack()
    if (!stack) { return null }
    if (!stack.turns) { return null }
    if (stack.turns.length == 0) { return null }

    return stack.firstTurn()
  }

  latestStack(): Stack {
    if (!this.stacks) { return null }
    if (this.stacks.length === 0) { return null }

    return this.stacks[this.stacks.length - 1]
  }
}
