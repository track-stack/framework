/*jshint esversion: 6 */

import { combineReducers }  from 'redux'
import lastFM from './lastfm'
import main from './main'
import admin from './admin'

export default combineReducers({
  lastFM,
  main,
  admin,
});
