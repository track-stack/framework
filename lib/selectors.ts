/*jshint esversion: 6 */

import {
  ANSWER_SUBMISSION,
  FETCH_FRIENDS,
  LAST_FM_SEARCH,
  FETCH_GAME,
  INVITEE
} from './constants'

import { Game, Friend } from './types'

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

interface FetchFriendsSelector {
  type: string
  data: [Friend]
}

export function _fetchFriends(friends: [Friend]) {
  return {
    type: FETCH_FRIENDS.SUCCESS,
    data: friends 
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

interface SelectGameInviteeSelector {
  type: string
  data: Friend
}

export function _selectGameInvitee(friend: Friend): SelectGameInviteeSelector {
  return {
    type: INVITEE.SELECTED,
    data: friend
  }
}