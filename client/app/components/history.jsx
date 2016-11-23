'use strict';

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

    const h = 700;
    const maxH = 500;
    const minH = 200;
    const w = 1280;
    const maxW = 1000;
    const minW = 200;
    const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["steelblue", "pink"]);
    const rscale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, 325]);

    const svg = d3.select(this.refs.hello)
    .append('svg')
    .attr('height', h)
    .attr('width', w)
    .attr('x', w / 2)
    .attr('y', h / 2);

      const circle = svg.selectAll('circle')
      .data(this.props.visData)
      .enter()
      .append('svg:circle')
      .attr('r', (d) => {
        return (rscale(d.visits)) / 2;
      })
      .attr('fill', (d, i) => {
        return (color(i));
      })
      .attr('cx', () => {
        return Math.floor(Math.random() * (maxW - minW)) + minW;
      })
      .attr('cy', (d) => {
        return Math.floor(Math.random() * (maxH - minH)) + minH;
      })
      .style('z-index', (d) => {
        return 100 - d.visits;
      })
      .append('svg:title')
      .text((d) => {
        return 'WEBSITE: ' + d.domain + ' | VISITS: ' + d.visits;
      });
      
  }

  render() {
    return (
      <div ref={'hello'} style={{ margin: 'auto' }} />
    );
  }
}
