const defaultState = { searchResults: [] }
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SEARCH': {
      return Object.assign({}, state, { searchResults: action.data });
    }
    default:
      return state;
  }
}

module.exports = reducer;
