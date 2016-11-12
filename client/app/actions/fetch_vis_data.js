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
    const microsecondsPerDay = 1000 * 60 * 60 * 24;
    const oneDayAgo = (new Date).getTime() - microsecondsPerDay;

    chrome.history.search({
      'text': '', // Return every history item....
      'startTime': oneDayAgo, // that was accessed less than one week ago.
    }, (array) => {
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
