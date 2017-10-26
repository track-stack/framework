/*jshint esversion: 6 */

const {
  FETCH_FRIENDS,
  ANSWER_SUBMISSION,
  FETCH_GAME,
  INVITEE
} = require('../constants')

const defaultState = { friends: [], game: null, error: null }

function reducer(state = defaultState, action) {
  switch (action.type) {
    case FETCH_FRIENDS.SUCCESS: {
      return Object.assign({}, state, { friends: action.data });
    }
    case INVITEE.SELECTED: {
      return Object.assign({}, state, { invitee: action.data });
    }
    case FETCH_GAME.SUCCESS: {
      return Object.assign({}, state, { game: action.data });
    }
    case ANSWER_SUBMISSION.START: {
      return Object.assign({}, state, { error: null });
    }
    case ANSWER_SUBMISSION.SUCCESS: {
      return Object.assign({}, state, { game: action.data });
    }
      case ANSWER_SUBMISSION.FAILURE: {
      return Object.assign({}, state, { error: action.data });
    }
    default:
      return state;
  }
}
module.exports = reducer;
