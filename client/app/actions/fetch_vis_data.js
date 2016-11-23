'use strict';

import axios from 'axios';

function loadVisDataUponResponse (data) {
  return {
    type: 'FETCH_VIS_DATA',
    payload: data,
  };
}

export default function fetchVisData (id) {
  console.log('fetch vis data', id);
  return function (dispatch) {
    const tenMinutes = 1000 * 60 * 60 * 72;
    const tenMinutesAgo = (new Date).getTime() - tenMinutes;

    chrome.history.search({
      'text': '', // Return every history item....
      'startTime': tenMinutesAgo, // that was accessed less than one week ago.
    }, (array) => {
      console.log('chrome history:', array);
      axios({
        method: 'post',
        url: process.env.HOST + '/api/history',
        data: { history: array, chromeID: id },
      }).then((response) => {
        dispatch(loadVisDataUponResponse(response));
      });
    });

    return null;
  };
}
