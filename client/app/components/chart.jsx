' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
  


@connect((store) => {
  return {
    weekData: store.weekData,
  };
})

export default class Chart extends React.Component {

  componentDidUpdate() {
    let data = this.props.weekData;
    console.log('chart data', data);


    const startDate = {
      'year': Number(data[0].day.slice(0,4)),
      'month': Number(data[0].day.slice(4,6)),
      'day': Number(data[0].day.slice(6))
    }

    const endDate = {
      'year': Number(data[data.length - 1].day.slice(0,4)),
      'month': Number(data[data.length - 1].day.slice(4,6)),
      'day': Number(data[data.length - 1].day.slice(6))
    }

//     //AGGREGATE TOTAL VISIT COUNT FOR ALL DOMAINS
    let totalDomainCount = [];
    let dates = [];
    for (const day of data) {
      totalDomainCount.push(day.total);
      dates.push(day.day);
    }

//     //MAX AND MIN VALUES FOR Y AXIS
    const max = Math.max(...totalDomainCount);
    const min = Math.min(...totalDomainCount);


    data = [];
    for (let i = 0; i < totalDomainCount.length; i++) {
      data.push({ count: totalDomainCount[i], date: dates[i] });
    }

    console.log('data', data);

    const svg = d3.select("svg"),
    margin = { top: 20, right: 80, bottom: 20, left: 50 },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
//     //X AND Y AXIS

//     //12 pm appearing on ticks between days 
    const x = d3.scaleTime().domain([new Date(startDate.year, startDate.month, startDate.day), new Date(endDate.year, endDate.month, endDate.day)]).range([0, width])

    const y = d3.scaleLinear().domain([min, max]).range([height, 0])


    const line = d3.line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.count); })
    // .interpolate('linear');


  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append('text')
      .attr("x", 40)
      .attr("y", 30)
      .attr("dx", "0.71em")
      .attr("fill", "#000")
      .text("Days");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Visit Count");



    svg.append("path")
      .attr("d", line(data))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  }

  render() {

    return (
      <svg width="960" height="500"></svg>
    );

  }

}

 // <div ref={'hello'} style={{ margin: 'auto' }} />