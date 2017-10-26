/*jshint esversion: 6 */

const {
  ANSWER_SUBMISSION,
  FETCH_FRIENDS,
  LAST_FM_SEARCH,
  FETCH_GAME,
  INVITEE
} = require('./constants')

export function _answerSubmissionStarted() {
  return { type: ANSWER_SUBMISSION.STARTED }
}

export function _answerSubmitted(game) {
  return {
    type: ANSWER_SUBMISSION.DONE,
    data: game,
  }
}

export function _answerSubmissionFailed(error) {
  return {
    type: ANSWER_SUBMISSION.FAILED,
    data: error
  }
}

export function _fetchFriends(results) {
  return {
    type: FETCH_FRIENDS.SUCCESS,
    data: results
  }
}

export function _performSearch(results) {
  return {
    type: LAST_FM_SEARCH.SUCCESS,
    data: results
  }
}

export function _fetchedGame(game) {
  return {
    type: FETCH_GAME.SUCCESS,
    data: game
  }
}

export function _selectGameInvitee(friend) {
  return {
    type: INVITEE.SELECTED,
    data: friend
  }
}