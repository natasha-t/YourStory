'use strict';

import axios from 'axios';

function loadCatDataUponResponse (data) {
  return {
    type: 'FETCH_CAT_DATA',
    payload: data,
  };
}

export default function fetchCatData (id) {
  // console.log('fetch cat data', id);
  return function(dispatch) {
    axios({
      method: 'GET',
      url: process.env.HOST + '/api/catData',
    })
    .then((response) => {
      dispatch(loadCatDataUponResponse(response));
    })
    .catch((err) => {
      console.log(err);
    })

    return null;
  };
}