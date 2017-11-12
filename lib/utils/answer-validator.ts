/*jshint esversion: 6 */

/* answer-validator.ts
 * 
 * Determines whether or not user generated input matches a result
 * returned from the Last.fm API
 * 
 * example: 
 *   
 *   const userInput = "elvis hound dog"
 *   const match = {artist: "Elvis Presley", name: "Hound Dog"}
 *   validate(userInput, match)
*/

import { sanitize } from './string-sanitizer'
import * as stem from 'stem-porter'

// Public: Returns the result that matches the user's input
// 
// userInput: string - User-generated input
// tracks: any[] - Track results from Last.fm

// Returns any 
export function findMatch(userInput: string, tracks: any[]): any {
  let match = null
  const limit = Math.min(tracks.length, 5)

  // Iterate through the first up-to-5 matches for more accuracy
  for (let i = 0; i < limit; i++) {
    const { artist, name } = tracks[i]
    console.log(`%c    Match found: ${name} - ${artist}`, 'color: #42A143')
    console.log("      Validating...")
    if (validate(userInput, { artist, name })) {
      match = tracks[i]
      console.log('%c        valid match!', 'color: #42A143')
      break
    } else {
      console.log('%c        not a valid match', 'color: #A62F2F')
    }
  }

  return match
}

// Public: Sanitizes the input and determines whether or not the 
// user-generated input is similar enough to the provided match
// 
// answer: string - User-generated input
// match: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
export function validate(answer: string, match: {artist: string, name: string}): boolean {
  console.group("        Sanitizing")

  const sAnswer = sanitize(answer)
  const sArtist = sanitize(match.artist)
  const sName = sanitize(match.name)

  console.log(`%c        answer: ${sAnswer}`, 'color: #4070B7')
  console.log(`%c        match.name: ${sName}`, 'color: #4070B7')
  console.log(`%c        match.artist: ${sArtist}`, 'color: #4070B7')

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
    artistMatch = sArtist.match(answerWithoutName)
    if (artistMatch && artistMatch.length > 0) {
      return true
    }
  }

  return false
} 

// Internal: A single abstraction to provide a custom layer on top
// of the porter-stemmer algorithm 
//
// word - string
// 
// Returns a string
function stemmed(word: string): string {
  if (word === "delivery") { return "deliver" }
  if (word === "trappin") { return "trap" }
  if (word === "american") { return "america" }
  return stem(word)
}

// Public: Finds the intersection between two strings (based on stems)
// 
// str1 - string
// str2 - string
//
// Returns a boolean
export function hasIntersection(str1: string, str2: string): boolean {
  console.group("        Comparing Names")

  const name1Stemmed = sanitize(str1).split(" ").map(word => stemmed(word))
  const name2Stemmed = sanitize(str2).split(" ").map(word => stemmed(word))

  console.log(`%c        stems: ${name1Stemmed}`, 'color: #4070B7')
  console.log(`%c        stems: ${name2Stemmed}`, 'color: #4070B7')
        
  let longerWordStemmed = name1Stemmed.length > name2Stemmed.length ? name1Stemmed : name2Stemmed
  let shorterWordStemmed = longerWordStemmed == name1Stemmed ? name2Stemmed : name1Stemmed

  const results = longerWordStemmed.filter(word => shorterWordStemmed.indexOf(word) !== -1)

  const foundOverlap = results.length > 0

  console.groupEnd()
  return foundOverlap
}
