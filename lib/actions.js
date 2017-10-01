const store = require('./store');

export function performSearch(query) {
  return dispatch => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=80b1866e815a8d2ddf83757bd97fdc76&format=json`)
      .then(response => response.json())
      .then((json) => {
        if (json.results) {
          return dispatch(_performSearch(json.results.trackmatches.track))
        }
        return dispatch(_performSearch([]))
      })
  }
}

function _performSearch(results) {
  return {
    type: "SEARCH",
    data: results
  }
}

