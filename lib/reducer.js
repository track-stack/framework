const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SAID_SOMETHING': {
      return Object.assign({}, state, { thingSaid: action.data })
    }
    default:
      return state;
  }
}

module.exports = reducer;
