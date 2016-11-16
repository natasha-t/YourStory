'use strict';

import axios from 'axios';

function loadCatDataUponResponse (data) {
  return {
    type: 'FETCH_CAT_DATA',
    payload: data,
  };
}

export default function fetchCatData (id) {
  console.log('fetch cat data', id);
  
}