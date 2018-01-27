interface SelectGameInviteeSelector {
  type: string
  data: {key: string, value: any}
}

export function _debug(data: {key: string, value: any}): SelectGameInviteeSelector {
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