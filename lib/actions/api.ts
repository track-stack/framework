import store from '../store'
import { findMatch, matchHasIntersection } from '../utils/turn-processor'
import { sanitize } from '../utils/sanitizer'
import { lastFMResponseVerifier } from '../utils/lastfm-response-verifier'
import {
  _answerSubmissionStarted,
  _answerSubmitted,
  _answerSubmissionFailed ,
  _fetchFriends,
  _performSearch,
  _fetchedGame,
  _selectGameInvitee,
  _loginSuccess,
  _setAccessToken,
  _fetchDashboardPending,
  _fetchDashboardSuccess,
  _fetchDashboardError,
  _unsetGame
} from '../selectors/site'
import { Game, FBFriend, Stack, DashboardGamePreview } from '../types'

import { staging } from '../utils/config'
const { appId, baseUrl } = staging

function performSearch({sanitizedAnswer}) {
  const apiKey = "80b1866e815a8d2ddf83757bd97fdc76"
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
}

function submitToServer(dispatch, token, gameId, answer, match, gameOver) {
  const headers = new Headers({
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  })

  const data = {
    answer: answer,
    match: match,
    game_over: gameOver,
    app_id: appId,
    access_token: token
  }

  fetch(`${baseUrl}/api/v1/games/${gameId}/turn`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json => {
    const game = Game.from(json.game)
    dispatch(_answerSubmitted(game))
  })
  .catch(error => {
    dispatch(_answerSubmissionFailed(error))
  })
}

export default {
  setAccessToken: (token: string) => {
    return dispatch => {
      dispatch(_setAccessToken(token))
    }
  },

  login: (token: string, expires: number, local: boolean, callback: (json: any) => void) => {
    return dispatch => {
      const headers = new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      })

      const data = {token: token, expires: expires, app_id: appId}
      return fetch(`${baseUrl}/api/v1/auth/create`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })
    }
  },

  selectGameInvitee: (friend: FBFriend) => {
    return dispatch => {
      return dispatch(_selectGameInvitee(friend))
    }
  },

  unsetGame: () => {
    return dispatch => {
      return dispatch(_unsetGame())
    }
  },

  fetchGame: (token, gameId) => {
    return dispatch => {
      const headers = new Headers({'X-Requested-With': 'XMLHttpRequest'})

      fetch(`${baseUrl}/api/v1/games/${gameId}?app_id=${appId}&access_token=${token}`, {
        credentials: 'same-origin',
        headers: headers
      }).then(response => response.json()).then(json => {
        const game = Game.from(json.game)
        return dispatch(_fetchedGame(game));
      })
    }
  },

  fetchFriends: () => {
    return dispatch => {
      fetch('/friends', { credentials: 'same-origin' })
        .then(response => response.json())
        .then(json => {
          const friends: [FBFriend] = json.friends.map(friend => FBFriend.from(friend))
          dispatch(_fetchFriends(friends))
        })
    }
  },

  submitAnswer: (token: string, answer: string, stack: Stack) => {
    return dispatch => {
      dispatch(_answerSubmissionStarted())

      // TODO: full sanitization before searching may be too agressive
      // Removing "by" and "-" may be enough
      const sanitizedAnswer = sanitize(answer)

      performSearch({sanitizedAnswer}).then(json => {

        // confirm that our input matches at least 1 track (check the top 5 results)
        // confirm that our match passes the test against the previous turn
        // if the stack can be ended, cofirm that our match passes the test against the first turn

        // make sure we get a response from Last.fm
        const tracks = lastFMResponseVerifier(json)
        if (tracks.length === 0) {
          dispatch(_answerSubmissionFailed(`No track found for ${answer}.`))
          return
        }

        // Attempt to find a match
        const match: {artist: string, name: string} = findMatch(answer, tracks)

        // Bail early we didn't find a match
        if (!match) {
          dispatch(_answerSubmissionFailed(`No track found for ${answer}.`))
          return
        }

        const previousTurn = stack.firstTurn()
        const hasOverlapWithPreviousTurn = matchHasIntersection(match, previousTurn.match)

        // Bail early if there's no overlap with previous turn
        if (!hasOverlapWithPreviousTurn) {
          dispatch(_answerSubmissionFailed("No similarity to the previous track."))
          return
        }

        // Bail early if the 2 artists are the same
        if (match.artist === previousTurn.match.artist) {
          dispatch(_answerSubmissionFailed("Can't play the same artist twice in a row."))
          return
        }

        const trackPlayedAlready = stack.turns.filter((turn) => {
          return turn.match.artist == match.artist && turn.match.name == match.name
        })

        if (trackPlayedAlready.length > 0) {
          dispatch(_answerSubmissionFailed("That song has already been played."))
          return
        }

        // validate match against first turN
        if (stack.canEnd) {
          const firstTurn = stack.lastTurn()
          const hasOverlapWithFirstTurn = matchHasIntersection(match, firstTurn.match)

          // winner
          if (hasOverlapWithFirstTurn) {
            submitToServer(dispatch, token, stack.gameId, answer, match, true)
            return
          }
        }

        // Submit our answer and match to the server
        submitToServer(dispatch, token, stack.gameId, answer, match, false)
      })
    }
  },

  fetchDashboard: (token) => {
    return dispatch => {
      dispatch(_fetchDashboardPending)

      const headers = new Headers({'X-Requested-With': 'XMLHttpRequest'})
      return fetch(`${baseUrl}/api/v1/dashboard?app_id=${appId}&access_token=${token}`, {
        credentials: 'same-origin',
        headers: headers
      })
      .then(response => {
        if (response.status !== 200) {
          return response.json()
        } else {
          throw Error(response.statusText)
        }
      })
      .then(response => response.json())
      .then(json => {
        const groups = json.active_game_previews
        for (const key in groups) {
          let previews = groups[key]
          groups[key] = previews.map(preview => DashboardGamePreview.from(preview))
        }
        const invites = []
        return dispatch(_fetchDashboardSuccess({
          previews: groups,
          invites: invites
        }));
      })
      .catch(error => {
        console.log(error)
        return dispatch(_fetchDashboardError(error));
      })
    }
  },

  postNotificationsToken: (accessToken, expoToken, deviceId) => {
    return dispatch => {
      const headers = new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      })

      const data = {
        access_token: accessToken,
        expo_token: expoToken,
        device_id: deviceId
      }

      return fetch(`${baseUrl}/api/v1/devices/register`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })
    }
  }
}
