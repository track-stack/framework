interface DebugValue {
  key: string, 
  value: string[] | null, 
  options?: any
}

interface DebugSelector {
  type: string
  data: DebugValue
}

export function _debug(data: DebugValue): DebugSelector {
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