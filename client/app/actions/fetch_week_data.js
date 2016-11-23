'use strict';

import axios from 'axios';

function loadWeekDataUponResponse (data) {
  return {
    type: 'FETCH_WEEK_DATA',
    payload: data,
  };
}

export default function fetchWeekData () {
  return function(dispatch) {
    axios({
      method: 'GET',
      url: process.env.HOST + '/api/weekData',
    })
    .then((response) => {
      console.log('week data from server', response)
      dispatch(loadWeekDataUponResponse(response));
    })
    .catch((err) => {
      console.log(err);
    });

    return null;

  };
}
