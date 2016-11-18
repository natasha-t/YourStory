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

  componentDidUpdate() {

    const data = this.props.catData;
 

    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d");

    var width = canvas.width,
        height = canvas.height,
        radius = Math.min(width, height) / 2;

    var colors = [
      "#1f77b4", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf", "#ff7f0e"
    ];

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70)
        .padAngle(0.03)
        .cornerRadius(8)
        .context(context);

   const pie = d3.pie();

   const arcs = pie.value(function(d) { return d.totalCount; })(data);

    context.translate(width / 2, height / 2);

    context.globalAlpha = 0.5;
    arcs.forEach(function(d, i) {
      context.beginPath();
      arc(d);
      context.fillStyle = colors[i];
      context.fill();
    });

    context.globalAlpha = 1;
    context.beginPath();
    arcs.forEach(arc);
    context.lineWidth = 1.5;
    context.stroke();
  }

  render() {
    return (
      <div> 
        <p> Hello </p>
        <canvas width="860" height="400"></canvas> 
      </div>
    );
  }
}