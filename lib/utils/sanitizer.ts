/*jshint esversion: 6 */

const BLACKLIST = "and|the|by|ft|remix"

const REGEX = {
  characters: /[,.!&+\(\)\[\]\-_]/g,
  articles: new RegExp(`\\b(${BLACKLIST})\\b`, 'g'),
  apostrophe: /[']/g,
  whitespace: /\s+/g
}

const FILTERS: ((string) => string)[] = [
  (input: string) => input.toLowerCase(),
  (input: string) => input.replace(REGEX.characters, ' '),
  (input: string) => input.replace(REGEX.articles, ''),
  (input: string) => input.replace(REGEX.apostrophe, ''),
  (input: string) => input.replace(REGEX.whitespace, ' ')
]

// Public: Puts the input string through a series of regex filters
// 
// input - string
// 
// Returns a string
export function sanitize(input: string): string {
  FILTERS.forEach(filter => input = filter(input))

  return input.trim()
}
