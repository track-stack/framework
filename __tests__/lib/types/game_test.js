/*jshint esversion: 6 */

import { Game } from '../../../lib/types'

test('works', () => {
  console.log(new Game(1, {viewer: {}, opponent: {}}, 1, []))
  expect(1).toEqual(1)
});
