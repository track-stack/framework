/*jshint esversion: 6 */

import store from './store'
import { findMatch, matchHasIntersection } from './utils/turn-processor'
import { sanitize } from './utils/sanitizer'
import { lastFMResponseVerifier } from './utils/lastfm-response-verifier'
import {
  _answerSubmissionStarted,
  _answerSubmitted,
  _answerSubmissionFailed ,
  _fetchFriends,
  _performSearch,
  _fetchedGame, _selectGameInvitee,
} from './selectors'

import { Game, FBFriend, Stack } from './types'

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

function submitToServer(dispatch, gameId, answer, match, gameOver) {
  const headers = new Headers({
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  })
  const data = { 
    answer: answer, 
    match: match,
    game_over: gameOver
  }

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

// TODO: Remove logs

export function submitAnswer(answer: string, stack: Stack) {
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
        _answerSubmissionFailed('no match found')
        return
      }

      // Attempt to find a match 
      const match: {artist: string, name: string} = findMatch(answer, tracks)

      // Bail early we didn't find a match
      if (!match) {
        _answerSubmissionFailed("no match found")
        return
      }

      const previousTurn = stack.firstTurn()
      const hasOverlapWithPreviousTurn = matchHasIntersection(match, previousTurn.match)


      // Bail early if there's no overlap with previous turn
      if (!hasOverlapWithPreviousTurn) {
        _answerSubmissionFailed("No similarity to the previous track")
        return
      }
      
      // Bail early if the 2 artists are the same
      if (match.artist === previousTurn.match.artist) {
        _answerSubmissionFailed("Can't play the same artist twice in a row")
        return
      }


      // validate match against first turn
      if (stack.canEnd) {
        const firstTurn = stack.lastTurn()
        const hasOverlapWithFirstTurn = matchHasIntersection(match, firstTurn.match)

        console.log('first', stack.lastTurn())
        console.log('last', stack.firstTurn())
        console.log('match', match)
        console.log('overlap', hasOverlapWithFirstTurn)

        // winner
        if (hasOverlapWithFirstTurn) {
          submitToServer(dispatch, stack.gameId, answer, match, true)
          return
        }
      }

      // Submit our answer and match to the server
      submitToServer(dispatch, stack.gameId, answer, match, false)
    })
  }
}
