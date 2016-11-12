import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class History extends React.Component {

  componentDidMount() {
    const svg = d3.select(this.refs.hello)
    .append('svg')
    .attr('height', 600)
    .attr('width', 1200);

    setInterval(() => {
    svg.selectAll('circle')
      .data(this.props.visData)
      .enter()
      .append('svg:circle')
      .attr('r', (d) => {
        return d.visits;
      })
      .attr('color', 'black')
      .attr('cx', () => {
        return Math.floor(Math.random() * 1000);
      })
      .attr('cy', () => {
        return Math.floor(Math.random() * 400);
      });
  }, 500);
  }

  render() {
    return (
      <div ref={'hello'} />
    );
  }
}
