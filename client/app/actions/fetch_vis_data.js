import axios from 'axios'
import { createAction } from 'redux-action'

function loadVisDataUponResponse (data) {
  return {
    type: 'FETCH_VIS_DATA',
    payload: data
  }
}

export default function fetchVisData (id) {
  return function (dispatch) {
    const microsecondsPerDay = 1000 * 60 * 60 * 24
    const oneDayAgo = (new Date).getTime() - microsecondsPerDay

    chrome.history.search({
      'text': '', // Return every history item....
      'startTime': oneDayAgo, // that was accessed less than one week ago.
    }, (array) => {
      console.log('chrome history', array)

      axios({
        method: 'post',
        url: 'http://localhost:3000/api/history', //'http://yourstory-app.herokuapp.com/api/history'
        data: {history: array, chromeId: id}
      }).then(response => {
        dispatch(loadVisDataUponResponse(response))
      })
    })

    return null
  }
}
