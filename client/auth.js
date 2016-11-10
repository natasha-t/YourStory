// import axios from 'axios';

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
      alert(x.response);
      //     axios.post('/api/users', {
      //
      // })
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
    };
    x.send();
  });
}