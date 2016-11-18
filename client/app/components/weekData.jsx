' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

@connect((store) => {
  return {
    weekData: store.weekData,
  };
})

export default class Chart extends React.Compenent {

  componentDidUpdate() {
    const data = this.props.weekData;
  }


  render() {
    return (
      <div>

      </div>
    };
  }




}