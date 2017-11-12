/*jshint esversion: 6 */

import { sanitize } from '../../../lib/utils/string-sanitizer'

test("strips parentheses", () => {
  const nameAndArtist = "song name by artist (featuring other artist)"
  const result = sanitize(nameAndArtist)
  expect(result).toEqual("song name artist featuring other artist")
})

test("strips brackets", () => {
  const nameAndArtist = "song name by artist [featuring other artist]"
  const result = sanitize(nameAndArtist)
  expect(result).toEqual("song name artist featuring other artist")
})

test("strips articles", () => {
  const stringWithArticles = "The something in the way and she the moves A"
  const result = sanitize(stringWithArticles)
  expect(result).toEqual("something way she moves")
})

test("strips puncutation", () => {
  const stringWithPuncutation = "don't hold me accountable evan p. donohue"
  const result = sanitize(stringWithPuncutation)
  expect(result).toEqual("dont hold me accountable evan p donohue")
})