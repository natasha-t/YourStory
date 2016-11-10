import axios from 'axios';
import { createAction } from 'redux-action';

export default function fetchVisData() {
  const microsecondsPerDay = 1000 * 60 * 60 * 24;
  const oneDayAgo = (new Date).getTime() - microsecondsPerDay;

  chrome.history.search({
    'text': '',              // Return every history item....
    'startTime': oneDayAgo, // that was accessed less than one week ago.
  }, (array) => {
    console.log('chrome history', array);
    const request = axios({
      method: 'post',
      url: 'http://yourstory-app.herokuapp.com/api/history',
      data: { history: array },
    });

    return {
      type: 'FETCH_VIS_DATA',
      payload: request,
    };
  });
}
