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

    const data = this.props.visData.sort((a, b) => {
      if (a.visits > b.visits) {
        return 1;
      }
      if (a.visits < b.visits) {
        return -1;
      }
      return 0;
    })

    const h = 360,
          w = 360,
          padding = 1.5,
          rootNode = data[data.length - 1],

          color = d3.scaleLinear()
            .domain([0, data.length])
            .range(["yellow", "pink"]),
          rscale = d3.scaleLinear()
            .domain([0, (h-20)])
            .range([0, (w-20)]);
          //
          // force = d3.layout.force()
          //   .nodes(data)
          //   .size([w, h])
          //   .gravity(.02)
          //   .charge(0)
          //   .start();

    const svg = d3.select('.bubble-container')
    .append('svg:svg')
    .attr('height', h)
    .attr('width', w)
    .style('display', 'flex')
    .style('justify-content', 'space-between');


    const tooltip = d3.select('.bubble-container')
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

      const circle = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('svg:circle')
      .attr('r', (d) => {
        return rscale(d.visits);
      })
      .attr('fill', (d, i) => {
        return (color(i));
      })
      .attr('cx', (d, i) => {
        return Math.floor(Math.random() * w)
      })
      .attr('cy', (d, i) => {
        return Math.floor(Math.random() * h)
      })
      .style('z-index', (d) => {
        return 100 - (d.visits);
      })
      .on("mouseover", ((d) => {
        let vis = 'visits';
        if (d.visits === 1) {
          vis = 'visit';
        }
        tooltip.html(
          '<strong>' +
            '<a href=http://www.' + d.domain + '</a>' + d.domain +
          '</strong><br><span>' +
             d.visits + ' ' + vis +
          '</span>');
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

  render(data) {

    const lineUpCircles = () => {
      return d3.selectAll('circle')
      .transition()
      .duration(1000)
      .attr('cx', (d, i) => {
        return (i * 10) + (i*10) + 'px';
      })
      .attr('cy', (d, i) => {
        return (i * 10) - (i*10) + 'px';
      })
    };

    return (
      <div>
        <div className='bubble-container'></div>
        <button onClick={lineUpCircles} />
      </div>
    );
  }
}
