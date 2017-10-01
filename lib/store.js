const thunkMiddleware = require('redux-thunk').default;
const { createStore, applyMiddleware } = require('redux');
const reducer = require('./reducer');

var store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware
  )
)
module.exports = store
