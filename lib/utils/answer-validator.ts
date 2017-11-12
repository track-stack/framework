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

// Public: Sanitizes the input and determines whether or not the 
// user-generated input is similar enough to the provided match
// 
// answer: string - User-generated input
// match: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean 
export function validate(answer: string, match: {artist: string, name: string}): boolean {
  const sAnswer = sanitize(answer)
  const sArtist = sanitize(match.artist)
  const sName = sanitize(match.name)

  console.log("        Sanitizing...")
  console.log(`%c          answer: ${sAnswer}`, 'color: #4070B7')
  console.log(`%c          match.name: ${sName}`, 'color: #4070B7')
  console.log(`%c          match.artist: ${sArtist}`, 'color: #4070B7')

  const Patterns = {
    name: new RegExp(sName, 'g'),
    artist: new RegExp(sArtist, 'g')
  }

  let nameMatch = sAnswer.match(Patterns.name)
  let artistMatch = sAnswer.match(Patterns.artist) 

  // if we have an exact match then we're 👌🏼
  if (nameMatch && artistMatch) {
    return true
  }

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