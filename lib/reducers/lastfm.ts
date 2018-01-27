import { LAST_FM_SEARCH } from '../constants'

const defaultState = { searchResults: [] }

export default function(state = defaultState, action) {
  switch (action.type) {
    case LAST_FM_SEARCH.SUCCESS: {
      return (<any>Object).assign({}, state, { searchResults: action.data });
    }
    default:
      return state;
  }
}