/*jshint esversion: 6 */

import store from './store'
const Levenshtein = require('levenshtein');
const {
  _answerSubmissionStarted,
  _answerSubmitted,
  _answerSubmissionFailed ,
  _fetchFriends,
  _performSearch,
  _fetchedGame,
  _selectGameInvitee,
} = require('./selectors');

export function selectGameInvitee(friend) {
  return dispatch => {
    return dispatch(_selectGameInvitee(friend))
    }
}

export function fetchGame(gameId) {
  return dispatch => {
    fetch(`/games/${gameId}`, {
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => response.json()).then(json => {
      return dispatch(_fetchedGame(json.game));
    })
  }
}

export function fetchFriends() {
  return dispatch => {
    fetch('/friends', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        dispatch(_fetchFriends(json.friends))
      })
  }
}

function performSearch({answer}) {
  const apiKey = "80b1866e815a8d2ddf83757bd97fdc76"
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${answer}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
}

function submitToServer({dispatch, gameId, answer, match, distance}) {
  const data = { answer, match, distance }
  fetch(`/games/${gameId}/turn`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
   .then(json => {
     dispatch(_answerSubmitted(json.game))
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
          const distance = new Levenshtein(match.name.toLowerCase(), answer.toLowerCase()).distance
          submitToServer({dispatch, gameId, answer, match, distance})
        } else {
          _answerSubmissionFailed("no match found")
        }
      } else {
        _answerSubmissionFailed("no match found")
      }
    })
  }
}
