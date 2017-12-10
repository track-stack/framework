/*jshint esversion: 6 */

import { sanitize } from '../../../lib/utils/sanitizer'

test("lowercases the input", () => {
  const str = "THESE WORDS ARE HERE"
  const sanitized = sanitize(str)
  expect(sanitize(str)).toEqual("these words are here")
})

test("replaces ( and ) with a space", () => {
  const str = "(stri(n)g)"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("stri n g")
})

test("replaces [ and ] with a space", () => {
  const str = "[stri[n]g]"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("stri n g")
})

test("replaces , with a space", () => {
  const str = "th,ese,wo,r,ds"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("th ese wo r ds")
})

test("replaces . with a space", () => {
  const str = "th.ese.wo.r.ds"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("th ese wo r ds")
})

test("replaces + with a space", () => {
  const str = "th+ese+wo + r+ds"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("th ese wo r ds")
})

test("replaces _ and - with a space", () => {
  const str = "th-ese-wo_-_r_ds"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("th ese wo r ds")
})

test("replaces ! with an 's'", () => {
  const str = "the!e word!"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("these words")
})

test("replaces $ with an 's'", () => {
  const str = "$even dollar$"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("seven dollars")
})

test("removes ' and '", () => {
  const str = "this and that and theandother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that theandother")
})

test("removes ' the '", () => {
  const str = "this the that the theandother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that theandother")
})

test("removes ' by '", () => {
  const str = "this by that by thebyother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that thebyother")
})

test("removes ' ft '", () => {
  const str = "this ft that ft theftother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that theftother")
})

test("removes ' feat '", () => {
  const str = "this feat that feat thefeatother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that thefeatother")
})

test("removes ' remix '", () => {
  const str = "this remix that remix theremixother"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this that theremixother")
})

test("removes '", () => {
  const str = "don't won't couldn't shouldn't"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("dont wont couldnt shouldnt")
})

test("removes &", () => {
  const str = "you & me & him & her & she & them & they"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("you me him her she them they")
})

test("removes @", () => {
  const str = "you @ me @ him @ her @ she @ them @ th@ey"
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("you me him her she them they")
})

test("strips additional white space", () => {
  const str = "  this   has a    lot of space      "
  const sanitized = sanitize(str)
  expect(sanitized).toEqual("this has a lot of space")
})