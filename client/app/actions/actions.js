import axios from 'axios';
import { createAction } from 'redux-action';

export default createAction('FETCH_VIS_DATA', () => {
  //  return axios.post('/api/history', {data: 'data'})
		// .then((res) => {
		// 	console.log('response from server', res);

  // 		return Promise.resolve(res.data.dummyData);
		// });

	const microsecondsPerDay = 1000 * 60 * 60 * 24;
	const oneDayAgo = (new Date).getTime() - microsecondsPerDay;

	chrome.history.search({
		'text': '',              // Return every history item....
		'startTime': oneDayAgo, // that was accessed less than one week ago.
	  }, (array) => {
	 		 console.log('chrome history', array);
	 });

});