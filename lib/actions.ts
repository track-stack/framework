/*jshint esversion: 6 */

import store from './store'
import {
  _answerSubmissionStarted,
  _answerSubmitted,
  _answerSubmissionFailed ,
  _fetchFriends,
  _performSearch,
  _fetchedGame,
  _selectGameInvitee,
} from './selectors'

import { Game, FBFriend } from './types'

export function selectGameInvitee(friend: FBFriend) {
  return dispatch => {
    return dispatch(_selectGameInvitee(friend))
  }


}

export function fetchGame(gameId) {
  const headers = new Headers({'X-Requested-With': 'XMLHttpRequest'})
  return dispatch => {
    fetch(`/games/${gameId}`, {
      credentials: 'same-origin',
      headers: headers
    }).then(response => response.json()).then(json => {
      const game = Game.from(json.game)
      return dispatch(_fetchedGame(game));
    })
  }
}

export function fetchFriends() {
  return dispatch => {
    fetch('/friends', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        const friends: [FBFriend] = json.friends.map(friend => {
          return FBFriend.from(friend) })
        dispatch(_fetchFriends(friends))
      })
  }
}

function performSearch({answer}) {
  const apiKey = "80b1866e815a8d2ddf83757bd97fdc76"
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${answer}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
}

function submitToServer({dispatch, gameId, answer, match}) {
  const headers = new Headers({
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  })
  const data = { answer, match }

  fetch(`/games/${gameId}/turn`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: JSON.stringify(data),
  }).then(response => response.json())
   .then(json => {
     const game = Game.from(json.game)
     dispatch(_answerSubmitted(game))
   })
  .catch(error => {
    dispatch(_answerSubmissionFailed(error))
  })
}

export function submitAnswer({gameId, answer}) {
  return dispatch => {
    dispatch(_answerSubmissionStarted())
    performSearch({answer}).then(json => {
      if (json && json.results && json.results.trackmatches) {
        const tracks = json.results.trackmatches.track;
        if (tracks.length > 0) {
          const match = tracks[0];
          submitToServer({dispatch, gameId, answer, match})
        } else {
          _answerSubmissionFailed("no match found")
        }
      } else {
        _answerSubmissionFailed("no match found")
      }
    })
  }
}
