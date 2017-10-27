/*jshint esversion: 6 */

import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers/index'

export default createStore(
  reducer,
  applyMiddleware(thunk)
)
