import {
  ANSWER_SUBMISSION,
  FETCH_FRIENDS,
  LAST_FM_SEARCH,
  FETCH_GAME,
  INVITEE,
  LOGIN,
  ACCESS_TOKEN,
  DASHBAORD,
  GAME
} from '../constants'

import { Game, FBFriend, DashboardGamePreview } from '../types'

interface AnswerSubmissionStartSelector {
  type: string
}

interface AnswerSubmittedSelector {
  type: string
  data: Game
}

interface FetchFriendsSelector {
  type: string
  data: [FBFriend]
}

interface AnswerSubmissionFailedSelector {
  type: string
  data: string
}

interface FetchGameSelector {
  type: string
  data: Game
}

interface SelectGameInviteeSelector {
  type: string
  data: FBFriend
}

export function _answerSubmissionStarted(): AnswerSubmissionStartSelector  {
  return {
    type: ANSWER_SUBMISSION.PENDING
  }
}

export function _answerSubmitted(game: Game): AnswerSubmittedSelector {
  return {
    type: ANSWER_SUBMISSION.SUCCESS,
    data: game,
  }
}

export function _answerSubmissionFailed(error): AnswerSubmissionFailedSelector {
  return {
    type: ANSWER_SUBMISSION.ERROR,
    data: error
  }
}

export function _fetchFriends(friends: [FBFriend]) {
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

export function _fetchedGame(game: Game): FetchGameSelector {
  return {
    type: FETCH_GAME.SUCCESS,
    data: game
  }
}

export function _selectGameInvitee(friend: FBFriend): SelectGameInviteeSelector {
  return {
    type: INVITEE.SUCCESS,
    data: friend
  }
}

interface LoginSuccess {
  type: string
  data: {
    user: any,
    accessToken: any
  }
}

export function _loginSuccess(json: any): LoginSuccess {
  return {
    type: LOGIN.SUCCESS,
    data: {
      user: json.user,
      accessToken: json.accessToken
    }
  }
}

interface SetAccessToken {
  type: string
  data: string
}
export function _setAccessToken(token: string): SetAccessToken {
  return {
    type: ACCESS_TOKEN.SET,
    data: token
  }
}

export function _fetchDashboardPending() {
  return {
    type: DASHBAORD.PENDING,
    data: null    
  }
}

interface Dashboard {
  previews: DashboardGamePreview[]
  invites: any[]
}
export function _fetchDashboardSuccess(previews: Dashboard) {
  return {
    type: DASHBAORD.SUCCESS,
    data: previews
  }
}

export function _fetchDashboardError(error: any) {
  return {
    type: DASHBAORD.ERROR,
    data: error
  }
}

export function _unsetGame() {
  return {
    type: GAME.UNSET
  }
}