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
    .domain([0, 30])
    .range(["orange", "pink"]);
    const rscale = d3.scaleLinear()
    .domain([0, h])
    .range([0, w]);


    const svg = d3.select('.bubble-container')
    .append('svg')
    .attr('height', h)
    .attr('width', w)


    const tooltip = d3.select('.bubble-container')
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

      const circle = svg.selectAll('circle')
      .data(this.props.visData)
      .enter()
      .append('circle')
      .attr('class', 'circle')
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
      .on("mouseover", ((d) => {
        let vis = 'visits';
        if(d.visits === 1) {
          vis = 'visit';
        }
        tooltip.html(
          '<strong>' + d.domain + '</strong><br><span>' + d.visits + ' ' + vis + '</span>');
        tooltip
        .style("visibility", "visible")
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+15)+"px")
        .style("textAlign", "center");
      }))
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

}

  render() {
    const lineUpCircles = () => {
      return d3.selectAll('circle')
      .transition()
      .duration(1000)
      .attr('cy', (d) => {
        return (d.visits * 10) + 'px';
      })
      .attr('cx', (d) => {
        return (d.visits * 10) + 'px';
      })
      .attr('margin', '50px')
    };

    return (
      <div>
        <div className='bubble-container'></div>
        <button onClick={lineUpCircles} />
      </div>
    );
  }
}
