import { AttributedString } from '../interfaces'

interface DebugSelector {
  type: string
  data: AttributedString 
}

export function _debug(data: AttributedString): DebugSelector {
  return {
    type: "DEBUG",
    data: data
  }
}

export function _reset() {
  return {
    type: "RESET"
  }
}