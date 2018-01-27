/*jshint esversion: 6 */

/* turn-processor.ts
 *
 * A suite of functions designed to process user-generated input
 * at various stages of the turn validation process
*/

import { sanitize } from './sanitizer'
import wordComponents from './word-components'
import * as stem from 'stem-porter'

interface DebugValue {
  key: string, 
  value: string[] | null, 
  options?: any
}

// Public: Given user-generated input and an array of
// tracks (json) from Last.fm, returns the track that
// approximately matches the user-generated input.
//
// userInput: string - User-generated input
// tracks: any[] - An array of tracks (json) from Last.fm
// debugCallback?: DebugValue - An optional debug callback function

// Returns any
export function findMatch(userInput: string, tracks: any[], debugCallback?: (arg: DebugValue) => void): any {
  let match = null
  const limit = Math.min(tracks.length, 10)

  for (let i = 0; i < limit; i++) {
    const { artist, name } = tracks[i]

    if (debugCallback) {
      debugCallback({
        key: `<span>Validating against</span> <u>${artist} - ${name}</u>`, 
        value: null
      })
    }

    if (validate(userInput, { artist, name }, debugCallback)) {
      return tracks[i]
    } 
  }
}


// Public: Given user-generated input and a single track (json) from the Last.fm API,
// tries to determine if the track provided is the track referenced in the user's input
//
// answer: string - User-generated input
// track: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
export function validate(answer: string, track: {artist: string, name: string}, debugCallback?: (arg: DebugValue) => void): boolean {
  if (debugCallback) {
    debugCallback({
      key: '<i>Validating match...</i>', 
      value: null, 
      options: { "indent": 1 }
    })
  }

  const sAnswer = sanitize(answer)
  const sArtist = sanitize(track.artist)
  const sName = sanitize(track.name)

  if (debugCallback) {
    debugCallback({
      key: '<span>Sanitizing values...</span>', 
      value: [
        `<b>Input: </b>${sAnswer}`,
        `<b>Artist: </b>${sArtist}`,
        `<b>Track: </b>${sName}`
      ],
      options: {"indent": 1}
    })
  }

  const Patterns = {
    name: new RegExp(sName, 'g'),
    artist: new RegExp(sArtist, 'g')
  }

  let nameMatch = sAnswer.match(Patterns.name)
  let artistMatch = sAnswer.match(Patterns.artist)

  if (debugCallback) {
    const nameMatchClass = nameMatch ? "success" : "error"
    const nameMatchText = nameMatch ? "yes" : "no"
    debugCallback({
      key: `<span>Do the track names match?</span> <span class="${nameMatchClass}">${nameMatchText}</span>`,
      value: null,
      options: {"indent": 1}
    })

    const artistMatchClass = artistMatch ? "success" : "error"
    const artistMatchText = artistMatch ? "yes" : "no"
    debugCallback({
      key: `<span>Do the artist names match?</span> <span class="${artistMatchClass}">${artistMatchText}</span>`,
      value: null,
      options: {"indent": 1}
    })
  }

  // if we have an exact match then we're 👌🏼
  if (nameMatch && artistMatch) { return true }

  // see if the artist exists in the match
  if (nameMatch && !artistMatch) {
    debugCallback({
      key: `<h4>Fuzzy match...</h4>`,
      value: null,
      options: {"indent": 1}
    })

    const nameMatchReg = new RegExp(sName, "gi")
    const answerWithoutName = sAnswer.replace(nameMatchReg, "").trim()
    const hasIntersection = stringHasIntersection(sArtist, answerWithoutName, debugCallback)

    const klass = hasIntersection ? "success" : "error"
    const text = hasIntersection ? "yes" : "no"

    if (hasIntersection) {
      return true
    } 
  }

  if (debugCallback) {
    debugCallback({
      key: '<span class="error">No match</span>', 
      value: null, 
      options: {"indent": 1}
    })
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

export function stringHasIntersection(left: string, right: string, debugCallback?: (arg: DebugValue) => void): boolean {
  return matchHasIntersection({artist: left, name: ""}, {artist: right, name: ""}, debugCallback)
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
function stemmedComponents(str: string, debugCallback?: (arg: DebugValue) => void): string[] {
  const transformed = stringThroughComponentTransform(str) 
  if (debugCallback) {
    debugCallback({
      key: `&rarr;&nbsp;&nbsp;&nbsp;${transformed}`,
      value: null,
      options: {indent: 3}
    })
  }

  if (debugCallback) {
    debugCallback({
      key: `<i>Sanitizing...</i>`,
      value: null,
      options: {indent: 3}
    })
  }

  const sanitized = sanitize(transformed)

  if (debugCallback) {
    debugCallback({
      key: `&rarr;&nbsp;&nbsp;&nbsp;${sanitized}`,
      value: null,
      options: {indent: 3}
    })
  }

  if (debugCallback) {
    debugCallback({
      key: `<i>Splitting digits...</i>`,
      value: null,
      options: {indent: 3}
    })
  }

  const result = splitDigits(sanitized)

  if (debugCallback) {
    debugCallback({
      key: `&rarr;&nbsp;&nbsp;&nbsp;${result}`,
      value: null,
      options: {indent: 3}
    })
  }

  if (debugCallback) {
    debugCallback({
      key: `<i>Stemming...</i>`,
      value: null,
      options: {indent: 3}
    })
  }

  const stemmed = result.split(' ').map(word => stem(word))

  if (debugCallback) {
    debugCallback({
      key: `&rarr;&nbsp;&nbsp;&nbsp;${stemmed}`,
      value: null,
      options: {indent: 3}
    })
  }

  return stemmed
}

export function matchHasIntersection(left: Match, right: Match, debugCallback?: (arg: DebugValue) => void): boolean {
  if (debugCallback) {
    debugCallback({
      key: `<b>input:</b> ${[left.name, left.artist].join(' ')}`,
      value: null,
      options: {indent: 2}
    })

    debugCallback({
      key: `<i>Running custom component transform...</i>`,
      value: null,
      options: {indent: 3}
    })
  }

  const aComponents = stemmedComponents([left.name, left.artist].join(' '), debugCallback)

  if (debugCallback) {
    debugCallback({
      key: `<b>input:</b> ${[right.name, right.artist].join(' ')}`,
      value: null,
      options: {indent: 2}
    })

    debugCallback({
      key: `<i>Running custom component transform...</i>`,
      value: null,
      options: {indent: 3}
    })
  }
  const bComponents = stemmedComponents([right.name, right.artist].join(' '), debugCallback)

  const long = aComponents.length > bComponents.length ? aComponents : bComponents 
  const short = long == aComponents ? bComponents : aComponents 

  const results = long.filter(word => {
    return short.indexOf(word) !== -1
  })

  if (debugCallback) {
    const lHTMLString = long.map(word => {
      const match = results.indexOf(word) !== -1
      const klass = match ? 'success' : ''
      return `<span class=${klass}>${word}</span>`
    }).join(' ')

    const sHTMLString = short.map(word => {
      const match = results.indexOf(word) !== -1
      const klass = match ? 'success' : ''
      return `<span class=${klass}>${word}</span>`
    }).join(' ')


    debugCallback({
      key: `${lHTMLString} <> ${sHTMLString}`,
      value: null,
      options: {indent: 2}
    })
  }

  return results.length > 0
}
