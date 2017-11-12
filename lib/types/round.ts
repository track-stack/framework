/*jshint esversion: 6 */

import Turn from './turn'

export default class Round {
  turns: Turn[]

  constructor(turns?: Turn[] | null) {
    this.turns = turns || new Array<Turn>()
  }

  static from(json: any): Round {
    if (!json.turns) { return new Round() }
    const turns = json.turns.map(turn => Turn.from(turn))
    return new Round(turns)
  }
}
