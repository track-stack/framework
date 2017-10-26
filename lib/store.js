/*jshint esversion: 6 */

const thunkMiddleware = require('redux-thunk').default;
const { createStore, applyMiddleware } = require('redux');
const reducer = require('./reducers/index');

var store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware
  )
)
module.exports = store
