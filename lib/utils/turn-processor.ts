/*jshint esversion: 6 */

/* turn-processor.ts
 *
 * A suite of functions designed to process user-generated input
 * at various stages of the turn validation process
*/

import { sanitize } from './sanitizer'
import wordComponents from './word-components'
import * as stem from 'stem-porter'

// Public: Given user-generated input and an array of
// tracks (json) from Last.fm, returns the track that
// approximately matches the user-generated input.
//
// userInput: string - User-generated input
// tracks: any[] - An array of tracks (json) from Last.fm

// Returns any
export function findMatch(userInput: string, tracks: any[]): any {
  let match = null
  const limit = Math.min(tracks.length, 5)

  for (let i = 0; i < limit; i++) {
    const { artist, name } = tracks[i]
    if (validate(userInput, { artist, name })) {
      return tracks[i]
    } 
  }

  // return error
}

// Public: Given user-generated input and a single track (json) from the Last.fm API,
// tries to determine if the track provided is the track referenced in the user's input
//
// answer: string - User-generated input
// track: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
export function validate(answer: string, track: {artist: string, name: string}): boolean {
  const sAnswer = sanitize(answer)
  const sArtist = sanitize(track.artist)
  const sName = sanitize(track.name)

  const Patterns = {
    name: new RegExp(sName, 'g'),
    artist: new RegExp(sArtist, 'g')
  }

  let nameMatch = sAnswer.match(Patterns.name)
  let artistMatch = sAnswer.match(Patterns.artist)

  // if we have an exact match then we're 👌🏼
  if (nameMatch && artistMatch) { return true }

  // see if the artist exists in the match
  if (nameMatch && !artistMatch) {
    const nameMatchReg = new RegExp(sName, "gi")
    const answerWithoutName = sAnswer.replace(nameMatchReg, "").trim()
    if (stringHasIntersection(sArtist, answerWithoutName)) {
      return true
    }
  }

  return false
}

// Public: Given two string, calculates whether there are overlapping words between
// the two strings after reducing each word to its stem.
//
// left - string
// right - string
//
// Returns a boolean
interface Match {
  name: string
  artist: string
}

export function stringHasIntersection(left: string, right: string): boolean {
  return matchHasIntersection({artist: left, name: ""}, {artist: right, name: ""})
}

// Private: Runs a string through a transform function which considers
// our custom word component mappings
//
// str - string
//
// Returns a string
function stringThroughComponentTransform(str: string): string {
  return str.split(' ').reduce((acc, word) => {
    const lower = word.toLowerCase()
    const components = wordComponents[lower]
    const words = components ? components : [word]
    return acc.concat(words)
  }, []).join(' ')
}

function splitDigits(str: string): string {
  return str.split(' ').reduce((acc, word) => {
    if (/^\d+$/.test(word)) {
      const split = word.split('');
      return acc.concat(split)
    }
    return acc.concat([word])
  }, []).join(' ')
}

// Private: Given a string, returns an array of transformed (see stringThroughComponentTransform),
// stemmed words.
// 
// str - string
//
// Returns a string[]
function stemmedComponents(str: string): string[] {
  const transformed = stringThroughComponentTransform(str)
  const sanitized = sanitize(transformed)
  const result = splitDigits(sanitized)

  console.log(result)

  return result.split(' ').map(word => stem(word))
}

export function matchHasIntersection(left: Match, right: Match): boolean {
  const aComponents = stemmedComponents([left.name, left.artist].join(' '))
  const bComponents = stemmedComponents([right.name, right.artist].join(' '))

  const long = aComponents.length > bComponents.length ? aComponents : bComponents 
  const short = long == aComponents ? bComponents : aComponents 

  const results = long.filter(word => {
    return short.indexOf(word) !== -1
  })

  return results.length > 0
}
