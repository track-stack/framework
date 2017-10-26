/*jshint esversion: 6 */

const defaultState = { searchResults: [] }
function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SEARCH': {
      return Object.assign({}, state, { searchResults: action.data });
    }
    default:
      return state;
  }
}
module.exports = reducer;
