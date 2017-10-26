/*jshint esversion: 6 */

const defaultState = { friends: [], game: null, error: null }

function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH': {
      return Object.assign({}, state, { friends: action.data });
    }
    case 'SELECTED_INVITEE': {
      return Object.assign({}, state, { invitee: action.data });
    }
    case 'GAME.FETCHED': {
      return Object.assign({}, state, { game: action.data });
    }
    case 'ANSWER_SUBMISSION.STARTED': {
      return Object.assign({}, state, { error: null });
    }
    case 'ANSWER_SUBMISSION.DONE': {
      return Object.assign({}, state, { game: action.data });
    }
    case 'ANSWER_SUBMISSION.FAILED': {
      return Object.assign({}, state, { error: action.data });
    }
    default:
      return state;
  }
}
module.exports = reducer;
