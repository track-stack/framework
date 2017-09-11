// import { createStore, applyMiddleware } from 'redux';
// import reducer from './reducer'

const { createStore, applyMiddleware } = require('redux');
const reducer = require('./reducer');

module.exports = createStore(reducer)
