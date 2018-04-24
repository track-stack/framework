/*jshint esversion: 6 */

import Turn from './turn'

export default class Stack {
  turns: Turn[]
  canEnd: boolean
  gameId: number
  ended: boolean

  constructor(turns: Turn[], canEnd: boolean, gameId: number, ended: boolean) {
    this.turns = turns || new Array<Turn>()
    this.canEnd = canEnd
    this.gameId = gameId
    this.ended = ended
  }

  latestTurn(): Turn {
    return this.turns[0]
  }

  firstTurn(): Turn {
    return this.turns[this.turns.length - 1]
  }

  static from(json: any): Stack {
    const turns = json.turns.reverse().map(turn => Turn.from(turn))
    return new Stack(turns, json.can_end, json.game_id, json.ended)
  }
}
