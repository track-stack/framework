/*jshint esversion: 6 */

import store from './store'
import { findMatch, hasIntersection } from './utils/turn-processor'
import { sanitize } from './utils/sanitizer'
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
  console.group = console.group || function(input: string) {}
  console.groupEnd = console.groupEnd || function() {}
  return dispatch => {
    dispatch(_answerSubmissionStarted())

    console.group(`INPUT: ${answer}`)
    console.log('  Searching Last.FM...')

    // TODO: full sanitization before searching may be too agressive
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

      // Bail early if the results are empty
      const tracks: any[] = json.results.trackmatches.track;
      if (tracks.length == 0) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        console.groupEnd()
        return
      }

      // Attempt to find a match 
      const match: {artist: string, name: string} = findMatch(answer, tracks)

      // Bail early we didn't find a match
      if (!match) {
        _answerSubmissionFailed("no match found")
        console.log('%c    No match found', 'color: #A62F2F')
        console.groupEnd()
        return
      }

      const previousTurn = stack.lastTurn()
      const hasOverlapWithPreviousTurn = hasIntersection(match, previousTurn.match)

      // validate match against previous turn

      // Bail early if there's no overlap
      if (!hasOverlapWithPreviousTurn) {
        _answerSubmissionFailed("Does not have any similar words with the previous answer")
        console.log('%c        No similiary to previous answer', 'color: #A62F2F')
        console.groupEnd()
        return
      }
      
      console.group("        Comparing Artists")
      console.log(`%c        ${match.artist}, ${previousTurn.match.artist}`, 'color: #4070B7')
      console.groupEnd()
      // Bail early if the 2 artists are the same
      if (match.artist === previousTurn.match.artist) {
        _answerSubmissionFailed("Can't play the same artist twice in a row")
        console.log("%c        Can't play the same artist twice in a row", "color: #A62F2F")
        console.groupEnd()
        return
      }

      // validate match against first turn
      if (stack.canEnd) {
        const firstTurn = stack.firstTurn()
        const hasOverlapWithFirstTurn = hasIntersection(match, firstTurn.match)

        // winner
        if (hasOverlapWithFirstTurn) {
          console.groupEnd()
          submitToServer(dispatch, stack.gameId, answer, match, true)
          return
        }
      }

      console.groupEnd()

      // Submit our answer and match to the server
      submitToServer(dispatch, stack.gameId, answer, match, false)
    })
  }
}
