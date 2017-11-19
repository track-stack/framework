/*jshint esversion: 6 */

const BLACKLIST = "a|an|and|the|in|by"

const REGEX = {
  hyphensAndUnderscores: /[-_]/g,
  characters: /[.'!&+\(\)\[\]]/g,
  articles: new RegExp(`\\b(${BLACKLIST})\\b`, 'g'),
  whitespace: /\s+/g
}

// Public: Puts the input string through a series of regex filters
// 
// input - string
// 
// Returns a string
export function sanitize(input: string): string {
  input = input.toLowerCase()
  input = input.replace(REGEX.characters, '')
  input = input.replace(REGEX.articles, '')
  input = input.replace(REGEX.hyphensAndUnderscores, ' ')
  input = input.replace(REGEX.whitespace, ' ')

  return input.trim()
}
