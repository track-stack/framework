/*jshint esversion: 6 */

import {
  ANSWER_SUBMISSION,
  FETCH_FRIENDS,
  LAST_FM_SEARCH,
  FETCH_GAME,
  INVITEE
} from './constants'

import {
  Game
} from './types'

interface AnswerSubmissionStartType {
  type: string
}

interface AnswerSubmittedType {
  type: string
  data: Game
}

interface AnswerSubmissionFailedType {
  type: string
  data: string
}

export function _answerSubmissionStarted(): AnswerSubmissionStartType {
  return { 
    type: ANSWER_SUBMISSION.START
  }
}

export function _answerSubmitted(game: Game): AnswerSubmittedType {
  return {
    type: ANSWER_SUBMISSION.SUCCESS,
    data: game,
  }
}

export function _answerSubmissionFailed(error): AnswerSubmissionFailedType {
  return {
    type: ANSWER_SUBMISSION.FAILURE,
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

interface FetchGameSelector {
  type: string
  data: Game
}

export function _fetchedGame(game: Game): FetchGameSelector {
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