interface DebugValue {
  key: string, 
  value: string[] | null, 
  options?: {
    key: string, 
    value: string | number
  }
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