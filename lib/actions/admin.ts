import store from '../store'
import { findMatch, matchHasIntersection } from '../utils/turn-processor'
import { sanitize } from '../utils/sanitizer'
import { lastFMResponseVerifier } from '../utils/lastfm-response-verifier'
import { _debug, _reset } from '../selectors/admin'
import { TagStyle, AttributedString } from '../interfaces'

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
      dispatch(_debug({
        key: `Received input: ${answer}`,
        options: { tags: [
          {
            tag: 'span', 
            range: [0, "Received input:".length]
          },
          {
            tag: 'u', 
            range: ['Received input: '.length, answer.length]
          }
        ]}
      }))

      dispatch(_debug({
        key: 'Sanitizing answer...', 
        options: { tags: [
          {
            tag: 'i', 
            range: [0, -1]
          }
        ]}
      }))

      const sanitizedAnswer = sanitize(answer)

      dispatch(_debug({
        key: `Sanitized answer: ${sanitizedAnswer}`, 
        options: { tags: [
          {
            tag: 'span', 
            range: [0, 'Sanitized answer:'.length]
          },
          {
            tag: 'u',
            range: ['Sanitized answer: '.length, sanitizedAnswer.length]
          }
        ]}
      }))

      dispatch(_debug({
        key: 'Last.fm',
        options: { tags: [
          {
            tag: 'h3', 
            range: [0, -1]
          }
        ]}
      }))

      dispatch(_debug({
        key: `Sending "${sanitizedAnswer}" to Last.fm`,
        options: { tags: [
          {
            tag: 'span', 
            range: [0, `Sending "${sanitizedAnswer}" to Last.fm`.length]
          }
        ]}
      }))

      performSearch({sanitizedAnswer}).then(json => {
        const tracks = lastFMResponseVerifier(json)

        if (tracks.length === 0) {
          dispatch(_debug({ 
            key: '0 results from Last.fm', 
            options: { tags: [
              {
                tag: 'span', 
                style: TagStyle.Error, 
                range: [0, -1]
              }
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
          options: {tags: [
            {
              tag: 'span', 
              range: [0, -1],
              style: TagStyle.Success
            }
          ]}
        }))

        trackList.forEach(track => {
          dispatch(_debug({
            key: track, 
            options: {indent: 3}
          }))
        })

        dispatch(_debug({
          key: 'Validation',
          options: {tags: [
            {
              tag: 'h3', 
              range: [0, -1]
            }
          ]}
        }))

        const match: {artist: string, name: string} = findMatch(answer, tracks, (retVal: AttributedString) => {
           dispatch(_debug(retVal))
        })

        if (!match) {
          dispatch(_debug({
            key: 'User input didn\'t match any results from Last.fm', 
            options: { tags: [
              {
                tag: 'span', 
                style: TagStyle.Error, 
                range: [0, -1]
              }
            ]}
          }))
          return
        }

        dispatch(_debug({
          key: 'Match found:', 
          options: { tags: [
            {
              tag: 'span', 
              style: TagStyle.Success, 
              range: [0, -1]
            }
          ]}
        }))

        dispatch(_debug({
          key: `${match.artist} - ${match.name}`,
          options: {indent: 2}
        }))
      })
    }
  }
}
