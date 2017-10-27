/*jshint esversion: 6 */

const thunkMiddleware = require('redux-thunk').default;
const { createStore, applyMiddleware } = require('redux');
const reducer = require('./reducers/index');

const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware
  )
)

export default store;
