import React from 'react';
import { connect } from 'react-redux';
import fetchVisData from '../actions/actions';
import store from '../store';

// setInterval(() => {
// 	store.dispatch(fetchVisData())
// }, 2000);

store.dispatch(fetchVisData());

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class App extends React.Component {

	render() {
	 const { visData } = this.props;
	 console.log('vis data in app component', visData);
	 return <div>
	    Hello from app
	 </div>
	}
}
