import {
  FETCH_FRIENDS,
  ANSWER_SUBMISSION,
  FETCH_GAME,
  INVITEE,
  ACCESS_TOKEN,
  DASHBAORD,
  GAME
} from '../constants'

const defaultState = { friends: [], game: null, error: null, invitee: null, accessToken: null, dashboard: []}

export default function(state = defaultState, action) {
  switch (action.type) {
    case FETCH_FRIENDS.SUCCESS: {
      return (<any>Object).assign({}, state, { friends: action.data });
    }
    case INVITEE.SUCCESS: {
      return (<any>Object).assign({}, state, { invitee: action.data });
    }
    case FETCH_GAME.SUCCESS: {
      return (<any>Object).assign({}, state, { game: action.data });
    }
    case ANSWER_SUBMISSION.PENDING: {
      return (<any>Object).assign({}, state, { error: null });
    }
    case ANSWER_SUBMISSION.SUCCESS: {
      return (<any>Object).assign({}, state, { game: action.data });
    }
    case ANSWER_SUBMISSION.ERROR: {
      return (<any>Object).assign({}, state, { error: action.data });
    }
    case ACCESS_TOKEN.SET: {
      return (<any>Object).assign({}, state, { accessToken: action.data })
    }
    case DASHBAORD.SUCCESS: {
      return (<any>Object).assign({}, state, { dashboard: action.data })
    }
    case GAME.UNSET: {
      return (<any>Object).assign({}, state, { game: null })
    }
    default:
      return state;
  }
}
