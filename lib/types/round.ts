/*jshint esversion: 6 */

import Turn from './turn'

export default class Round {
  turns: [Turn]

  constructor(turns: [Turn]) {
    this.turns = turns
  }

  static from(json: any): Round {
    const turns = json.turns.map(turn => Turn.from(turn))
    return new Round(turns)
  }
}
