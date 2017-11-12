/*jshint esversion: 6 */

import store from './store'
import { validate } from './utils/answer-validator'
import { sanitize } from './utils/string-sanitizer'
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

function performSearch({sanitizedAnswer}) {
  const apiKey = "80b1866e815a8d2ddf83757bd97fdc76"
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
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

function validateAnswer(tracks: any[], {answer, previousAnswer}) {
  let match = null
  const limit = Math.min(tracks.length, 5)

  for (let i = 0; i < limit; i++) {
    const { artist, name } = tracks[i]
    console.log(`%c    Match found: ${name} - ${artist}`, 'color: #42A143')
    console.log("      Validating...")
    if (validate(answer, previousAnswer, { artist, name }).valid) {
      match = tracks[i]
      console.log('%c        valid match!', 'color: #42A143')
      break
    } else {
      console.log('%c        not a valid match', 'color: #A62F2F')
    }
  }

  return match
}

// TODO: Remove logs

export function submitAnswer({gameId, answer, previousAnswer}) {
  return dispatch => {
    dispatch(_answerSubmissionStarted())

    console.log(`%c INPUT: ${answer}`, 'font-weight: bold')
    console.log('  Searching Last.FM...')

    // TODO: sanitization here may be too agressive
    // Removing "by" and "-" may be enough
    const sanitizedAnswer = sanitize(answer)
    performSearch({sanitizedAnswer}).then(json => {
      const foundTracks = json && json.results && json.results.trackmatches
      if (!foundTracks) {
        _answerSubmissionFailed('no match found')
        console.log('%c    No match found', 'color: #A62F2F')
        return
      }

      const tracks = json.results.trackmatches.track;
      if (tracks.length == 0) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        return
      }

      const match = validateAnswer(tracks, {answer, previousAnswer})

      if (!match) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        return
      }
      submitToServer({dispatch, gameId, answer, match})
    })
  }
}
