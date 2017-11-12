/*jshint esversion: 6 */

import store from './store'
import { findMatch, hasIntersection } from './utils/answer-validator'
import { sanitize } from './utils/string-sanitizer'
import {
  _answerSubmissionStarted,
  _answerSubmitted,
  _answerSubmissionFailed ,
  _fetchFriends,
  _performSearch,
  _fetchedGame, _selectGameInvitee,
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
    console.log("a")
    const game = Game.from(json.game)
    console.log("b")
    dispatch(_answerSubmitted(game))
    console.log("c")
  })
  .catch(error => {
    dispatch(_answerSubmissionFailed(error))
  })
}

// TODO: Remove logs

export function submitAnswer({gameId, answer, previousTurn}) {
  console.group = console.group || function(input: string) {}
  console.groupEnd = console.groupEnd || function() {}
  return dispatch => {
    dispatch(_answerSubmissionStarted())

    console.group(`INPUT: ${answer}`)
    console.log('  Searching Last.FM...')

    // TODO: sanitization here may be too agressive
    // Removing "by" and "-" may be enough
    const sanitizedAnswer = sanitize(answer)

    // search Last.fm
    performSearch({sanitizedAnswer}).then(json => {

      // Bail early if the response lacks the required json structure
      const foundTracks = json && json.results && json.results.trackmatches
      if (!foundTracks) {
        _answerSubmissionFailed('no match found')
        console.log('%c    No match found', 'color: #A62F2F')
        console.groupEnd()
        return
      }

      // Bail earily if the results are empty
      const tracks: any[] = json.results.trackmatches.track;
      if (tracks.length == 0) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        console.groupEnd()
        return
      }

      // Attempt to find a match 
      const match: {artist: string, name: string} = findMatch(answer, tracks)

      // Bail earily we didn't find a match
      if (!match) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        console.groupEnd()
        return
      }

      // validate match against previous turn
      const hasOverlap = hasIntersection(match.name, previousTurn.match.name)

      // Bail early if there's no overlap
      if (!hasOverlap) {
        _answerSubmissionFailed("Does not have any similar words with the previous answer")
        console.log('%c        No similiary to previous answer', 'color: #A62F2F')
        console.groupEnd()
        return
      }
      
      console.group("        Comparing Artists")
      console.log(`%c        ${match.artist}, ${previousTurn.match.artist}`, 'color: #4070B7')
      console.groupEnd()
      if (match.artist === previousTurn.match.artist) {
        _answerSubmissionFailed("Can't play the same artist twice in a row")
        console.log("%c        Can't play the same artist twice in a row", "color: #A62F2F")
        console.groupEnd()
        return
      }
      // validate match against first turn

      console.groupEnd()

      // Submit our answer and match to the server
      submitToServer({dispatch, gameId, answer, match})
    })
  }
}
