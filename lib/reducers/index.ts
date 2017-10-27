/*jshint esversion: 6 */

import { combineReducers }  from 'redux'
import lastFM from './lastfm'
import main from './main'

export default combineReducers({
  lastFM,
  main
});
