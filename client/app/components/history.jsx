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

  componentWillUpdate() {

    const h = window.innerHeight;
    const w = window.innerWidth - 50;
    const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["orange", "pink"]);
    const rscale = d3.scaleLinear()
    .domain([0, h])
    .range([0, w]);


    const svg = d3.select('.bubble-container')
    .append('svg')
    .attr('height', h)
    .attr('width', w)

      const circle = svg.selectAll('circle')
      .data(this.props.visData)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        return rscale(d.visits);
      })
      .attr('fill', (d, i) => {
        return (color(i));
      })
      .attr('cx', () => {
        return Math.floor(Math.random() * w);
      })
      .attr('cy', () => {
        return Math.floor(Math.random() * h);
      })
      .style('z-index', (d) => {
        return 100 - (d.visits);
      })

      const div = d3.select('body').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        circle.on("mouseover", function(d) {
              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div	.html(d.domain+ "<br/>"  + d.visits)
                  .style("left", (d.visits) + "px")
                  .style("top", (d.visits) + "px");
              })
          circle.on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
  })
}

  render() {
    return (
      <div className='bubble-container' />
    );
  }
}
