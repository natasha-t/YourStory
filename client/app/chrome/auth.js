'use strict';

import axios from 'axios';
import fetchVisData from '../actions/fetch_vis_data';
import fetchCatData from '../actions/fetch_cat_data';
import fetchWeekData from '../actions/fetch_week_data';
import fetchUsername from '../actions/fetch_username';
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
      console.log('User info from chrome: ', userInfo);
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
            store.dispatch(fetchCatData(response));
            store.dispatch(fetchUsername(response));
            store.dispatch(fetchWeekData(response));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    x.send();
  });
}
