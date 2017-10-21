const store = require('./store');

// SELECT GAME INVITEE
function _selectGameInvitee(friend) {
  return {
    type: "SELECTED_INVITEE",
    data: friend
  }
}

export function selectGameInvitee(friend) {
  return dispatch => {
    return dispatch(_selectGameInvitee(friend))
  }
}

// FETCH GAME
function _fetchedGame(game) {
  return {
    type: "GAME.FETCHED",
    data: game
  }
}

export function fetchGame(gameId) {
  return dispatch => {
    fetch(`/games/${gameId}`, {
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => response.json())
      .then(json => {
        return dispatch(_fetchedGame(json["game"]));
      })
  }
}

// PERFORM MUSIC SEARCH
function _performSearch(results) {
  return {
    type: "SEARCH",
    data: results
  }
}

export function performSearch(query) {
  return dispatch => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=80b1866e815a8d2ddf83757bd97fdc76&format=json`)
      .then(response => response.json())
      .then(json => {
        if (json.results) {
          return dispatch(_performSearch(json.results.trackmatches.track))
        }
        return dispatch(_performSearch([]))
      })
  }
}

// FETCH FRIENDS
function _fetchFriends(results) {
  return {
    type: "FETCH",
    data: results
  }
}

export function fetchFriends() {
  return dispatch => {
    fetch('/friends', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        dispatch(_fetchFriends(json["friends"]))
      })
  }
}

function _answerSubmitted(game) {
  return {
    type: "ANSWER_SUBMISSION.DONE",
    data: game
  }
}

export function submitAnswer({gameId, answer}) {
  return dispatch => {
    const data = JSON.stringify({answer})
    console.log(data)
    fetch(`/games/${gameId}/turn`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: data,
   }).then(response => response.json())
     .then(json => {
       dispatch(_answerSubmitted(json["game"]))
     })
  }
}
