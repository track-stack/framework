/*jshint esversion: 6 */

/* turn-processor.ts
 * 
 * A suite of functions designed to process user-generated input 
 * at various stages of the turn validation process
*/

import { sanitize } from './sanitizer'
import * as stem from 'stem-porter'

declare global {
  interface Window { Logger: any }
}

// Public: Given user-generated input and an array of
// tracks (json) from Last.fm, returns the track that 
// approximately matches the user-generated input.
// 
// userInput: string - User-generated input
// tracks: any[] - An array of tracks (json) from Last.fm

// Returns any 
export function findMatch(userInput: string, tracks: any[]): any {
  window.Logger = window.Logger || {log: function(str) {}}

  let match = null
  const limit = Math.min(tracks.length, 5)

  for (let i = 0; i < limit; i++) {
    const { artist, name } = tracks[i]
    console.log(`%c    Match found: ${name} - ${artist}`, 'color: #42A143')
    window.Logger.log(`<span class="green">    Match found: ${name} - ${artist}</span>`)
    console.log("      Validating...")
    window.Logger.log("      Validating...")
    if (validate(userInput, { artist, name })) {
      match = tracks[i]
      console.log('%c        valid match!', 'color: #42A143')
      window.Logger.log('<span class="green">        valid match!</span>')
      break
    } else {
      console.log('%c        not a valid match', 'color: #A62F2F')
      window.Logger.log('<span class="red">        not a valid match</span>')
    }
  }

  return match
}

// Public: Given user-generated input and a single track (json) from the Last.fm API,
// tries to determine if the track provided is the track referenced in the user's input
// 
// answer: string - User-generated input
// track: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
export function validate(answer: string, track: {artist: string, name: string}): boolean {
  console.group = console.group || function(input: string) {}
  console.groupEnd = console.groupEnd || function() {}
  window.Logger = window.Logger || {log: function(str) {}}

  console.group("        Sanitizing")
  window.Logger.log("<b>        Sanitizing</b>")

  const sAnswer = sanitize(answer)
  const sArtist = sanitize(track.artist)
  const sName = sanitize(track.name)

  console.log(`%c          answer: ${sAnswer}`, 'color: #4070B7')
  console.log(`%c          match.name: ${sName}`, 'color: #4070B7')
  console.log(`%c          match.artist: ${sArtist}`, 'color: #4070B7')

  window.Logger.log(`          answer: ${sAnswer}`)
  window.Logger.log(`          match.name: ${sName}`)
  window.Logger.log(`          match.artist: ${sArtist}`)

  console.groupEnd()

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

// Internal: A layer of abstraction, which provides an opportunity
// to add inject custom behavior into stemming algorithm
// 
// word - string
// 
// Returns a string
function stemmed(word: string): string {
  if (word === "delivery") { return "deliver" }
  if (word === "trappin") { return "trap" }
  if (word === "american") { return "america" }

  // defer to the algo
  return stem(word)
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

export function matchHasIntersection(left: Match, right: Match): boolean {
  console.group = console.group || function(input: string) {}
  window.Logger = window.Logger || {log: function(str) {}}

  const leftStr = [left.name, left.artist].join(" ")
  const rightStr = [right.name, right.artist].join(" ")
  const sLeft = sanitize(leftStr)
  const sRight = sanitize(rightStr)
  const lStemmed = sanitize(sLeft).split(" ").map(word => stemmed(word))
  const rStemmed = sanitize(sRight).split(" ").map(word => stemmed(word))

  console.log(`%c          stems: ${lStemmed}`, 'color: #4070B7')
  console.log(`%c          stems: ${rStemmed}`, 'color: #4070B7')

  window.Logger.log(`          stems: ${lStemmed}`)
  window.Logger.log(`          stems: ${rStemmed}`)
        
  const long = lStemmed.length > rStemmed.length ? lStemmed : rStemmed 
  const short = long == lStemmed ? rStemmed : lStemmed 

  const results = long.filter(word => {
    return short.indexOf(word) !== -1
  })

  const foundOverlap = results.length > 0

  console.groupEnd()
  return foundOverlap
}
