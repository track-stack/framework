const defaultState = { friends: [], game: null }
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
    case 'ANSWER_SUBMISSION.DONE': {
      return Object.assign({}, state, { game: action.data });
    }
    default:
      return state;
  }
}
module.exports = reducer;
