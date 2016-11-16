' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

@connect((store) => {
  return {
    catData: store.catData,
  };
})

export default class Categories extends React.Component {

  componentDidMount() {

  }

  render() {
    return (
      <div> Hello </div>
    );
  }
}