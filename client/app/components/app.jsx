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

	 var data = [];

	 for(var i = 0; i < visData.length; i++) {
	 	data.push(<div><span> Domain: { visData[i].domain } Count: { visData[i].visits } </span></div>)
	 }


	 console.log(data);
	 
	 return <div>
	 		{ data }
	 	</div>

	}
}
