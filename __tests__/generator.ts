/*jshint esversion: 6 */

import * as faker from 'faker'
import { 
  Turn,
  Game,
  Stack
} from '../lib/types'

import {
  generateTurn,
  generateStack,
  generateGame 
} from './generators'

export function generate(className: string, json: boolean = false, options: any = {}) {
  switch(className) {
    case 'Turn':
      return generateTurn(json)
    case 'Game':
      return generateGame(json, options)
  }
}
