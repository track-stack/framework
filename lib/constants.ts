/*jshint esversion: 6 */

import { createActionSet } from './utils/action-helper'

export const ANSWER_SUBMISSION = createActionSet('ANSWER_SUBMITTED')
export const FETCH_FRIENDS = createActionSet('FETCH_FRIENDS')
export const LAST_FM_SEARCH = createActionSet('LAST_F_SEARCH')
export const FETCH_GAME = createActionSet('FETCH_GAME')
export const LOGIN = createActionSet('LOGIN')
export const INVITEE = createActionSet('INVITEE')
export const ACCESS_TOKEN = { SET: 'ACCESS_TOKEN_SET' }
export const DASHBAORD = createActionSet('DASHBOARD')
export const GAME = { UNSET: 'GAME_UNSET'}
