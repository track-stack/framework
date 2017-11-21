/*jshint esversion: 6 */

import { sanitize } from '../../../lib/utils/sanitizer'

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
  expect(result).toEqual("something in way she moves a")
})

test("strips ' and .", () => {
  const stringWithPuncutation = "don't hold me accountable evan p. donohue"
  const result = sanitize(stringWithPuncutation)
  expect(result).toEqual("dont hold me accountable evan p donohue")
})

test("strips +", () => {
  const string = "Florence + the Machine"
  const result = sanitize(string)
  expect(result).toEqual("florence machine")
})

test("strips &", () => {
  const string = "hootie & the blowfish"
  const result = sanitize(string)
  expect(result).toEqual("hootie blowfish")
})