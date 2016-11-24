'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import _ from 'underscore';

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class History extends React.Component {

  componentDidMount() {

    const data = _.uniq(this.props.visData.sort((a, b) => {
      if (a.visits > b.visits) {
        return 1;
      }
      if (a.visits < b.visits) {
        return -1;
      }
      return 0;
    }).slice(-15), (datum) => {return datum.domain; }).reverse();


    const h = 360,
          w = 360,
          radius = d3.scaleLinear()
            .domain([data.length, 1])
            .range([1, 50]),

          color = d3.scaleLinear()
            .domain([0, data.length])
            .range(["steelblue", "pink"]);

    const svg = d3.select('#bubble-container')
    .append('svg:svg')
    .attr('height', h)
    .attr('width', w)


    const tooltip = d3.select('#bubble-container')
      .append("div")
      .style("position", "absolute")
      .style("z-index", "100")
      .style("visibility", "hidden")

      const circle = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('a')
      .attr('xlink:href', (d) => {
        return 'http://www.' + d.domain;
      })
      .append('svg:circle')
      .attr('cx', () => {
        return Math.floor(Math.random() * (w))
      })
      .attr('cy', () => {
        return Math.floor(Math.random() * (h))
      })
      .on("mouseover", ((d, i) => {

          const vis = d.visits > 1 ? 'visits' : 'visit';

          tooltip.html(
            '<strong>' +
              d.domain +
            '</strong><br><span>' +
                d.visits + ' ' + vis +
            '</span>');
                tooltip
                .style("visibility", "visible")
                .style("top", h - 50 + 'px')
                .style("left", w - 100 + 'px')
                .style("textAlign", "center");

          svg.selectAll("circle")
            .call(function (circle) {
              circle
              .classed('hover', true)
              .transition(1500)
              .attr('r', (d, i) =>{
                return radius(i);
              })
            })
          }))
          .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
            d3.selectAll('circle')
            .call(function (circle) {
              circle
              .classed('hover', false)
              .transition(1500)
              .attr('r', (d, i) =>{
                return radius(i)
              });
            });
       })
      .transition()
      .duration(2000)
      .attr('r', (d, i) => {
        return radius(i);
      })
      .attr('fill', (d, i) => {
        return (color(i + 1));
      })


  }

  render(data) {

    return (
        <div id="bubble-container"></div>
    );
  }
}
