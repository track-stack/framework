/*jshint esversion: 6 */

import { sanitize } from './string-sanitizer'

interface AnswerValidation {
  exactArtistMatch: boolean
  exactNameMatch: boolean
  confidence: number
  valid: boolean
}

export function validate(answer: string, previousAnswer: string, match: {artist: string, name: string}): AnswerValidation {
  const result: AnswerValidation = {
    valid: false,
    exactArtistMatch: false,
    exactNameMatch: false,
    confidence: 0.0
  }

  const sAnswer = sanitize(answer)
  const sPreviousAnswer = sanitize(previousAnswer)
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
  if (nameMatch && nameMatch.length > 0) {
    result.exactNameMatch = true
  }

  let artistMatch = sAnswer.match(Patterns.artist) 
  if (artistMatch && artistMatch.length > 0) {
    result.exactArtistMatch = true
  }

  // if we have an exact match then we're 👌🏼
  if (nameMatch && artistMatch) {
    result.confidence = 100.0
    result.valid = true
  
    return result
  }

  // see if the artist exists in the match
  if (nameMatch && !artistMatch) {
    const nameMatchReg = new RegExp(sName, "gi")
    const answerWithoutName = sAnswer.replace(nameMatchReg, "").trim()
    artistMatch = sArtist.match(answerWithoutName)
    if (artistMatch && artistMatch.length > 0) {
      result.exactArtistMatch = true
      result.confidence = 100.0
      result.valid = true

      return result
    }
  }

  return result
} 