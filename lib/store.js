const thunkMiddleware = require('redux-thunk').default;
const { createStore, applyMiddleware } = require('redux');
const reducer = require('./reducer');

module.exports = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware
  )
)
