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

interface DebugValue {
  key: string, 
  value: string[] | null, 
  options?: {
    key: string, 
    value: string | number
  }
}

export default {
  reset: () => {
    return dispatch => {
      dispatch(_reset())
    }
  },

  submitAnswer: (answer: string) => {
    return dispatch => {
      dispatch(_debug({key: `<span>Received input:</span> ${answer}`, value: null}))
      dispatch(_debug({key: '<i>Sanitizing answer...</i>', value: null}))

      const sanitizedAnswer = sanitize(answer)

      dispatch(_debug({
        key: `<span>Sanitized answer:</span> ${sanitizedAnswer}`, 
        value: null
      }))

      dispatch(_debug({
        key: '<h3>Last.fm',
        value: null
      }))

      dispatch(_debug({
        key: `<span>Sending "${sanitizedAnswer}" to Last.fm</b></span>`,
        value: null
      }))

      performSearch({sanitizedAnswer}).then(json => {

        const tracks = lastFMResponseVerifier(json)
        if (tracks.length === 0) {
          dispatch(_debug({ key: '<span class="error">0 results from Last.fm</span>', value: null }))
          return
        }

        const trackList = tracks.map(track => {
          const { artist, name } = track;
          return `${artist} - ${name}`
        })

        dispatch(_debug({key: '<span class="success">Response:</span>', value: trackList}))

        dispatch(_debug({
          key: '<h3>Validation</h3>',
          value: null
        }))

        const match: {artist: string, name: string} = findMatch(answer, tracks, (arg: DebugValue) => {
           dispatch(_debug({key: arg.key, value: arg.value, options: arg.options}))
        })

        if (!match) {
          dispatch(_debug({key: '<span class="error">User input didn\'t match any results from Last.fm</span>', value: null}))
          return
        }

        dispatch(_debug({
          key: '<span class="success">Match found:</span  >', 
          value: [`${match.artist} - ${match.name}`]
        }))
      })
    }
  }
}
