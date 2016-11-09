import axios from 'axios';
import { createAction } from 'redux-action';

// export default function() {
// 	const request =  axios.post('/api/history', {data: 'data'})
// 		.then((res) => {
// 			console.log('response from server', res);
// 			return res.data.dummyData;
// 		});

// 	return {
// 		type: "FETCH_VIS_DATA",
// 		payload: request
// 	}


// }

export default createAction('FETCH_VIS_DATA', (...args) => {
  //  return axios.post('/api/history', {data: 'data'})
		// .then((res) => {
		// 	console.log('response from server', res);

  // 		return Promise.resolve(res.data.dummyData);
		// });

		var microsecondsPerDay = 1000 * 60 * 60 * 24;
		var oneDayAgo = (new Date).getTime() - microsecondsPerDay;
		chrome.history.search({
		      'text': '',              // Return every history item....
		      'startTime': oneDayAgo  // that was accessed less than one week ago.
		    }, function(array){
		        console.log('chrome history', array);
		        
		})


})