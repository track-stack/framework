/*jshint esversion: 6 */

import {
  FETCH_FRIENDS,
  ANSWER_SUBMISSION,
  FETCH_GAME,
  INVITEE
} from '../constants'

const defaultState = { friends: [], game: null, error: null }

export default function(state = defaultState, action) {
  switch (action.type) {
    case FETCH_FRIENDS.SUCCESS: {
      return (<any>Object).assign({}, state, { friends: action.data });
    }
    case INVITEE.SELECTED: {
      return (<any>Object).assign({}, state, { invitee: action.data });
    }
    case FETCH_GAME.SUCCESS: {
      return (<any>Object).assign({}, state, { game: action.data });
    }
    case ANSWER_SUBMISSION.START: {
      return (<any>Object).assign({}, state, { error: null });
    }
    case ANSWER_SUBMISSION.SUCCESS: {
      return (<any>Object).assign({}, state, { game: action.data });
    }
      case ANSWER_SUBMISSION.FAILURE: {
      return (<any>Object).assign({}, state, { error: action.data });
    }
    default:
      return state;
  }
}