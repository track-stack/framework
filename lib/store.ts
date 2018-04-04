import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { main, admin } from './reducers'

export default function ({reducers, middleware}) {
  reducers = (<any>Object).assign({}, {main, admin}, reducers)
  return createStore(
    combineReducers(reducers),
    applyMiddleware(...middleware, thunk)
  )
}
