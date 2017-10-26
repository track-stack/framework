export function _answerSubmissionStarted() {
  return { type: "ANSWER_SUBMISSION.STARTED" }
}

export function _answerSubmitted(game) {
  return {
    type: "ANSWER_SUBMISSION.DONE",
    data: game,
  }
}

export function _answerSubmissionFailed(error) {
  return {
    type: "ANSWER_SUBMISSION.FAILED",
    data: ""
  }
}

export function _fetchFriends(results) {
  return {
    type: "FETCH",
    data: results
  }
}

export function _performSearch(results) {
  return {
    type: "SEARCH",
    data: results
  }
}

export function _fetchedGame(game) {
  return {
    type: "GAME.FETCHED",
    data: game
  }
}

export function _selectGameInvitee(friend) {
  return {
    type: "SELECTED_INVITEE",
    data: friend
  }
}

