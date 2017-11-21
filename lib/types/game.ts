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

  constructor(id: number, players: GamePlayers, status: number, stacks: Stack[]) {
     this.id = id
     this.players = players
     this.status = status
     this.stacks = stacks
  }

  static from(json: any): Game {
    const stacks = json.stacks.map(stack => Stack.from(stack))
    const players: GamePlayers = {
      viewer: json.players.viewer,
      opponent: json.players.opponent
    }
    return new Game(json.id, players, json.status, stacks)
  }

  lastTurn(): Turn {
    const stack = this.lastStack()
    if (!stack) { return null }
    if (!stack.turns) { return null }
    if (stack.turns.length == 0) { return null }

    return stack.lastTurn()
  }

  firstTurn(): Turn {
    const stack = this.lastStack()
    if (!stack) { return null }
    if (!stack.turns) { return null }
    if (stack.turns.length == 0) { return null }

    return stack.firstTurn()
  }

  lastStack(): Stack {
    if (!this.stacks) { return null }
    if (this.stacks.length === 0) { return null }

    return this.stacks[this.stacks.length - 1]
  }
}
