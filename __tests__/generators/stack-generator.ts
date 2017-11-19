/*jshint esversion: 6 */

import * as faker from 'faker'
import { Stack } from '../../lib/types'
import generateTurn from './turn-generator'

export default function generateStack(json: boolean, options: {turnCount: number}): any | Stack {
  const turnCount = options.turnCount || 0

  let turns = []
  for (var i = 0; i < options.turnCount; i++) {
    turns.push(generateTurn(true))
  }

  // json
  const raw = {
    turns: turns
  }

  if (json) { return raw }
  return Stack.from(raw)
}

