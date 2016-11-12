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
    const h = 720;
    const w = 1280;
    const svg = d3.select(this.refs.hello)
    .append('svg')
    .attr('height', h)
    .attr('width', w);

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
        return Math.floor(Math.random() * (w - 80));
      })
      .attr('cy', () => {
        return Math.floor(Math.random() * (h - 20));
      })
      .append('svg:title')
      .text((d) => {
        return d.domain;
      })
      .on('mouseover', (d) => {
        return d.domain;
      })
  }, 500);
  }

  render() {
    return (
      <div ref={'hello'} />
    );
  }
}
