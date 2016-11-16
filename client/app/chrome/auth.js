'use strict';

import axios from 'axios';
import fetchVisData from '../actions/fetch_vis_data';
<<<<<<< 90a44db70125d1e09b6fd2399c9980705a4704f1
import fetchCatData from '../actions/fetch_cat_data';
=======
>>>>>>> [refactor] add proxy redux storee
import store from '../store';

export default function getToken() {
  chrome.identity.getAuthToken({
    interactive: true,
  }, (token) => {
    if (chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
      return;
    }
    const x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    x.onload = function () {
      const userInfo = JSON.parse(x.response);
      console.log('User info from chrome: ', userInfo.id);
      axios({
        method: 'post',
        url: process.env.HOST + '/api/users', // 'http://yourstory-app.herokuapp.com/api/history'
        data: { chromeID: userInfo.id, username: userInfo.name },
      })
        .then((response) => {
          const chromeID = JSON.parse(response.config.data).chromeID;
          console.log('CHROME ID', chromeID);
          //add interval before pushing 
            store.dispatch(fetchVisData(response));
        .catch((error) => {
          console.log(error);
        });
    };
    x.send();
  });
}

