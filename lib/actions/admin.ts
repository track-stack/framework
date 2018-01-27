import store from '../store'
import { findMatch, matchHasIntersection } from '../utils/turn-processor'
import { sanitize } from '../utils/sanitizer'
import { lastFMResponseVerifier } from '../utils/lastfm-response-verifier'
import { _debug, _reset } from '../selectors/admin'

import { Game, FBFriend, Stack } from '../types'

function performSearch({sanitizedAnswer}) {
  const apiKey = "80b1866e815a8d2ddf83757bd97fdc76"
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
}

export default {
  reset: () => {
    return dispatch => {
      dispatch(_reset())
    }
  },

  submitAnswer: (answer: string) => {
    return dispatch => {
      dispatch({type: "debug", data: `Answer submitted: ${answer}`})
      dispatch({type: "debug", data: "Sanitizing answer"})

      const sanitizedAnswer = sanitize(answer)

      dispatch(_debug({key: 'Sanitized answer:', value: sanitizedAnswer}))

      performSearch({sanitizedAnswer}).then(json => {

        const tracks = lastFMResponseVerifier(json)
        if (tracks.length === 0) {
          dispatch(_debug({ key: "0 results from Last.fm", value: null }))
          return
        }

        const trackStrings = tracks.map(track => {
          const { artist, name } = track;
          return `  Artist: ${artist}, Track: ${name}`
        })

        dispatch(_debug({key: "Tracks received", value: trackStrings}))

        const match: {artist: string, name: string} = findMatch(answer, tracks)

        if (!match) {
          dispatch(_debug({key: "User input didn't match any results from Last.fm", value: null}))
          return
        }

        dispatch(_debug({key: "Match found:", value: `Artist: ${match.artist}, Song: ${match.name}`}))
      })
    }
  }
}
