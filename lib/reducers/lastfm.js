/*jshint esversion: 6 */

const { 
  LAST_FM_SEARCH
} = require('../constants')

const defaultState = { searchResults: [] }

function reducer(state = defaultState, action) {
  switch (action.type) {
    case LAST_FM_SEARCH.SUCCESS: {
      return Object.assign({}, state, { searchResults: action.data });
    }
    default:
      return state;
  }
}
module.exports = reducer;
