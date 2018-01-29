/*jshint esversion: 6 */

const BLACKLIST = "and|the|by|ft|remix|feat"

const FILTERS: ((string) => string)[] = [
  (input: string) => input.toLowerCase(),
  (input: string) => input.replace(/\(feat.*\)/, ''),
  (input: string) => input.replace(/[,.+\(\)\[\]\-_—]/g, ' '),
  (input: string) => input.replace(/[$!]/g, 's'),
  (input: string) => input.replace(new RegExp(`\\b(${BLACKLIST})\\b`, 'g'), ''),
  (input: string) => input.replace(/['&@]/g, ''),
  (input: string) => input.replace(/\s+/g, ' ')
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
