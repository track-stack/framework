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
  options?: any
}

export default {
  reset: () => {
    return dispatch => {
      dispatch(_reset())
    }
  },

  submitAnswer: (answer: string) => {
    return dispatch => {
      dispatch(_debug({
        key: `Received input: ${answer}`,
        value: null,
        options: { tags: [
          {tag: 'span', range: [0, "Received input:".length]},
          {tag: 'u', range: ['Received input: '.length, answer.length]}
        ]}
      }))

      dispatch(_debug({
        key: 'Sanitizing answer...', 
        value: null,
        options: { tags: [
          {tag: 'i', range: [0, 'Sanitizing answer...'.length]}
        ]}
      }))

      const sanitizedAnswer = sanitize(answer)

      dispatch(_debug({
        key: `Sanitized answer: ${sanitizedAnswer}`, 
        value: null,
        options: { tags: [
          {tag: 'span', range: [0, 'Sanitized answer:'.length]}
        ]}
      }))

      dispatch(_debug({
        key: 'Last.fm',
        value: null,
        options: { tags: [
          {tag: 'h3', range: [0, 'Last.fm'.length]}
        ]}
      }))

      dispatch(_debug({
        key: `Sending "${sanitizedAnswer}" to Last.fm`,
        value: null,
        options: { tags: [
          {tag: 'span', range: [0, `Sending "${sanitizedAnswer}" to Last.fm`.length]}
        ]}
      }))

      performSearch({sanitizedAnswer}).then(json => {
        const tracks = lastFMResponseVerifier(json)

        if (tracks.length === 0) {
          dispatch(_debug({ 
            key: '0 results from Last.fm', 
            value: null,
            options: { tags: [
              {tag: 'span', style: 'error', range: [0, '0 results from Last.fm'.length]}
            ]}
          }))
          return
        }

        const trackList = tracks.map(track => {
          const { artist, name } = track;
          return `${artist} - ${name}`
        })

        dispatch(_debug({
          key: 'Response:', 
          value: trackList,
          options: { tags: [
            {tag: 'span', style: 'success', range: [0, 'Response:'.length]}
          ]}
        }))

        dispatch(_debug({
          key: 'Validation',
          value: null,
          options: { tags: [
            {tag: 'h3', range: [0, 'Validation'.length]}
          ]}
        }))

        const match: {artist: string, name: string} = findMatch(answer, tracks, (arg: DebugValue) => {
           dispatch(_debug({key: arg.key, value: arg.value, options: arg.options}))
        })

        if (!match) {
          dispatch(_debug({
            key: 'User input didn\'t match any results from Last.fm', 
            value: null,
            options: { tags: [
              {tag: 'span', style: 'error', range: [0, 'User input didn`t match any results from Last.fm'.length]}
            ]}
          }))
          return
        }

        dispatch(_debug({
          key: 'Match found:', 
          value: [`${match.artist} - ${match.name}`],
          options: { tags: [
            {tag: 'span', style: 'success', range: [0, 'Match found:'.length]}
          ]}
        }))
      })
    }
  }
}
