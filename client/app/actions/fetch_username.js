'use strict';

import axios from 'axios';

function loadUsernameUponResponse (data) {
  return {
    type: 'FETCH_USERNAME',
    payload: data,
  };
}

export default function fetchUsername (id) {
  return function(dispatch) {
    axios({
      method: 'GET',
      url: process.env.HOST + '/api/username',
    })
    .then((response) => {
      dispatch(loadUsernameUponResponse(response));
    })
    .catch((err) => {
      console.log("error getting username", err);
    })

    return null;
  };
}
