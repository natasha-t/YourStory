' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';


@connect((store) => {
  return {
    weekData: store.weekData,
  };
})

export default class Graph extends React.Component {

  componentDidMount() {
    // let data = this.props.weekData;

    // console.log('WEEK DATA IN GRAPH COMPONENT', data);

     let data = [{
      date: '20161018',
      domains: [{ domain: 'learn.makerpass.com', visits: 103 },
                  { domain: 'repl.it', visits: 30 },
                  { domain: 'allData', visits: 311 }],
      },
      { date: '20161019',
        domains: [{ domain: 'learn.makerpass.com', visits: 17 },
                  { domain: 'repl.it', visits: 4 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161020',
        domains: [{ domain: 'learn.makerpass.com', visits: 35 },
                  { domain: 'repl.it', visits: 12 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161021',
        domains: [{ domain: 'learn.makerpass.com', visits: 250 },
                  { domain: 'repl.it', visits: 50 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161022',
        domains: [{ domain: 'learn.makerpass.com', visits: 45 },
                  { domain: 'repl.it', visits: 20 },
                 { domain: 'allData', visits: 200 }],
      },
      { date: '20161023',
        domains: [{ domain: 'learn.makerpass.com', visits: 200 },
                  { domain: 'repl.it', visits: 44 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161024',
        domains: [{ domain: 'learn.makerpass.com', visits: 20 },
                  { domain: 'repl.it', visits: 17 },
                  { domain: 'allData', visits: 200 }],
      }]  



    //======== ALL DOMAINS =========
    const startDate = {
      'year': Number(data[0].date.slice(0, 4)),
      'month': Number(data[0].date.slice(4, 6)),
      'date': Number(data[0].date.slice(6))
    }

    const endDate = {
      'year': Number(data[data.length - 1].date.slice(0, 4)),
      'month': Number(data[data.length - 1].date.slice(4, 6)),
      'date': Number(data[data.length - 1].date.slice(6))
    }


    let totalDomainCount = [];
    let dates = [];
    for (const day of data) {
      dates.push(new Date(day.date.slice(0, 4), day.date.slice(4, 6), day.date.slice(6)));
      for (const domain of day.domains) {
        totalDomainCount.push(domain.visits);
      }
    }


    //MAX AND MIN VALUES FOR Y AXIS
    const max = Math.max(...totalDomainCount);
    const min = Math.min(...totalDomainCount);

    console.log('max: ', max, 'min: ', min);

    //======= PER DOMAIN ========
    const lineDataGenerator = (data, inputDomain) => {
      let domainData = [];
      for (const day of data) {
        for (const domain of day.domains) {
          if (domain.domain === inputDomain) {
            domainData.push({ count: domain.visits, date: new Date(day.date.slice(0, 4), day.date.slice(4, 6), day.date.slice(6)) })
          }
        }
      }
     return domainData;      
    };

    const allDomains = lineDataGenerator(data, 'allData');

    console.log('makerpass data', allDomains);


    //======= CREATE SVG ELEMENT =======
    const svg = d3.select("svg"),
    margin = { top: 20, right: 80, bottom: 20, left: 50 },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    //======= CREATE X AND Y SCALES ======
    //12 pm appearing on ticks between days 
    const x = d3.scaleTime().domain([new Date(startDate.year, startDate.month, startDate.date), new Date(endDate.year, endDate.month, endDate.date)]).range([0, width])
    const y = d3.scaleLinear().domain([min, max]).range([height, 0])


    //ASSIGN X AND Y VALUES FOR LINE PATH
    const line = d3.line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.count); });


    //DRAW X AND Y AXIS
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

    //APPEND ALL DOMAINS LINE TO GRAPH 
    // svg.append("path")
    //    .attr("d", line(allDomainsdata))
    //    .attr("stroke", "blue")
    //    .attr("stroke-width", 2)
    //    .attr("fill", "none");


    svg.append("path")
       .attr("d", line(allDomains))
       .attr("stroke", "red")
       .attr("stroke-width", 2)
       .attr("fill", "none")

  }

  render() {
    return (
      <div id="graph"><svg width="960" height="200"></svg></div>
    );
  }

}

 // <div ref={'hello'} style={{ margin: 'auto' }} />