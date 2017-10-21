const { combineReducers } = require('redux')
const lastFM = require('./lastfm')
const main = require('./main')

module.exports = combineReducers({
  lastFM,
  main
});
