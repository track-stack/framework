/*jshint esversion: 6 */

import Turn from './turn'

export default class Stack {
  turns: Turn[]

  constructor(turns?: Turn[]) {
    this.turns = turns || new Array<Turn>()
  }

  static from(json: any): Stack {
    if (!json.turns) { return new Stack() }
    const turns = json.turns.map(turn => Turn.from(turn))
    return new Stack(turns)
  }
}
