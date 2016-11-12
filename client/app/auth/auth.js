import axios from 'axios';
import fetchVisData from '../actions/fetch_vis_data';
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
        url: 'http://localhost:3000/api/users', // 'http://yourstory-app.herokuapp.com/api/history'
        data: { chromeID: userInfo.id, username: userInfo.name },
      })
        .then((response) => {
          var chromeID = JSON.parse(response.config.data).chromeID;
          console.log('CHROME ID', chromeID);
          setInterval(() => {
            store.dispatch(fetchVisData(chromeID));
          }, 30000);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    x.send();
  });
}
