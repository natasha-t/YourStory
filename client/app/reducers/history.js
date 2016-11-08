import axios from 'axios';
import chrome from '../../manifest.json';

const historyReducer =  (state) => {
  // const oneMinute = 1000 * 60;
  // const oneMinuteAgo = (new Date()).getTime() - oneMinute;

  // return chrome.history.search({
  //   text: '',              // Return every history item....
  //   startTime: oneMinuteAgo,  // that was accessed less than one minute ago.
  // },
  // (historyItems) => {
  //   axios.post('/api/history', historyItems)
  //   .then((res) => {
  //     console.log(res);
  //     return {...state, visData: res.body.dummyData };
  //   });
  // });

  axios.post('/api/history', {data: 'data'})
    .then((res) => {
      console.log('server response', res);
      return {visData: res.body.dummyData}
    });

};

export default historyReducer;
