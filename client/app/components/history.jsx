import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import fetchVisData from '../actions/fetch_vis_data';


@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class History extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
   const { visData } = this.props;

   var data = [];

   for(var i = 0; i < visData.length; i++) {
    data.push(<div key={i}><span> Domain: { visData[i].domain } Count: { visData[i].visits } </span></div>)
   }

   
   return <div>
      { data }
    </div>

  }

}

