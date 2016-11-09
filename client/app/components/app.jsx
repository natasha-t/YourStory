import React from 'react';
import { connect } from 'react-redux';
import fetchVisData from '../actions/actions';
import store from '../store';


@connect((store) => {
  return {
    visData: store.visData,
  };
})

// @store.dispatch(fetchVisData())

export default class App extends React.Component {
	componentDidMount() {
		this.props.dispatch(fetchVisData());
	}

	render() {
	 const { visData } = this.props;
	 console.log('vis data in app component', visData);
	 return <div>
		{ visData[0].domain }
	 </div>
	}
}
