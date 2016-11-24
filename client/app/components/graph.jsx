' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

//TODO: REMOVE STORE, ONLY USING PROPS
@connect((store) => {
  return {
    weekData: store.weekData,
  };
})

export default class Graph extends React.Component {

  componentDidMount() {
    // let data = this.props.weekData;

   // console.log("GRAPH DATA", this.props.weekData)

     let data = [{
      date: '20161018',
      domains: [{ domain: 'learn.makerpass.com', visits: 103 },
                  { domain: 'repl.it', visits: 100 },
                  { domain: 'allData', visits: 211 }],
      },
      { date: '20161019',
        domains: [{ domain: 'learn.makerpass.com', visits: 78 },
                  { domain: 'repl.it', visits: 57 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161020',
        domains: [{ domain: 'learn.makerpass.com', visits: 35 },
                  { domain: 'repl.it', visits: 100 },
                  { domain: 'allData', visits: 150 }],
      },
      { date: '20161021',
        domains: [{ domain: 'learn.makerpass.com', visits: 250 },
                  { domain: 'repl.it', visits: 50 },
                  { domain: 'allData', visits: 99 }],
      },
      { date: '20161022',
        domains: [{ domain: 'learn.makerpass.com', visits: 45 },
                  { domain: 'repl.it', visits: 55 },
                 { domain: 'allData', visits: 106 }],
      },
      { date: '20161023',
        domains: [{ domain: 'learn.makerpass.com', visits: 200 },
                  { domain: 'repl.it', visits: 90 },
                  { domain: 'allData', visits: 200 }],
      },
      { date: '20161024',
        domains: [{ domain: 'learn.makerpass.com', visits: 20 },
                  { domain: 'repl.it', visits: 17 },
                  { domain: 'haveibeenpwned.com', visits: 20 },
                  { domain: 'redux.js.org', visits: 21 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 20 },
                  { domain: 'getbootstrap.com', visits: 13 },
                  { domain: 'npmjs.com', visits: 11 }],
        count: 122,
      }]


    // console.log('chart data', data);


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


    //take domains from array at index 0 of data
      //pass each domain into lineDataGenerator

    // const repl = lineDataGenerator('repl.it');
    // const makerPass = lineDataGenerator('learn.makerpass.com');
    // const allDomains = lineDataGenerator('allData');


    //======= CREATE SVG ELEMENT =======
    const svg = d3.select('svg'),
    margin = { top: 20, right: 80, bottom: 20, left: 50 },
    width = svg.attr('width') - margin.left - margin.right,
    height = svg.attr('height') - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    //======= CREATE X AND Y SCALES ======
    //12 pm appearing on ticks between days
    const x = d3.scaleTime().domain([new Date(startDate.year, startDate.month, startDate.date), new Date(endDate.year, endDate.month, endDate.date)]).range([0, width]);
    const y = d3.scaleLinear().domain([min, max]).range([height, 0]);


    //DRAW X AND Y AXIS
    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
      .append('text')
        .attr('x', 40)
        .attr('y', 30)
        .attr('dx', '0.71em')
        .attr('fill', '#000')
        .text('Days');

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text('Visit Count');

        //======= PER DOMAIN ========

    const lineDataGenerator = (inputDomain) => {
      let domainData = [];
      for (const day of data) {
        for (const domain of day.domains) {
          if (domain.domain === inputDomain) {
            domainData.push({ count: domain.visits, date: new Date(day.date.slice(0, 4), day.date.slice(4, 6), day.date.slice(6)) });
          }
        }
      }
      return domainData;
    };


    //MAKE LINE PATH
    const generateLine = () => {
      return d3.line()
            .x((d) => { return x(d.date) })
            .y((d) => { return y(d.count) });
    }

    //APPEND ALL DOMAINS LINE TO GRAPH
    //+++ add css class to distinguish each line +++

    const makeCircle = () => {

    }

    const generateSVG = (domain, color) => {
      svg.append('path')
       .attr('d', generateLine()(domain))
       .attr('stroke', color)
       .attr('stroke-width', 2)
       .attr('fill', 'none')
       .transition()
       .duration(2000)
       .ease('linear')
       .attr('stroke-dashoffset', 0);

       
       svg.selectAll('.circle')
       .data(domain)
       .enter()
       .append('svg:circle')
       .attr('class', 'graph-circle')
       .attr('fill', color)
       .attr('r', 3.5)
       .attr('cx', (d) => {
         return x(d.date);
       })
       .attr('cy', (d) => {
         return y(d.count);
       })

       return svg;
    };


    const createDomainPath = (domain, color) => {
      return generateSVG(lineDataGenerator(domain), color);
    }


    //+++ somehow render all svgs at once by iterating +++
    for (const domain of data[0].domains) {
     createDomainPath(domain.domain, '#' + Math.floor(Math.random() * 16777215).toString(16));
    }


  }

  render() {
    return (
      <div id='graph'><svg width='960' height='200'></svg></div>
    );
  }

}

 // <div ref={'hello'} style={{ margin: 'auto' }} />
