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

  componentDidUpdate() {
    // let data = this.props.weekData;


     let data = [{
      date: '20161018',
      domains:[{ domain: 'learn.makerpass.com', visits: 103 },
                  { domain: 'repl.it', visits: 30 },
                  { domain: 'haveibeenpwned.com', visits: 21 },
                  { domain: 'redux.js.org', visits: 73 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 30 },
                  { domain: 'getbootstrap.com', visits: 25 },
                  { domain: 'npmjs.com', visits: 29 }],
      count: 311,
    },
      { date: '20161019',
        domains: [{ domain: 'learn.makerpass.com', visits: 17 },
                  { domain: 'repl.it', visits: 4 },
                  { domain: 'haveibeenpwned.com', visits: 40 },
                  { domain: 'redux.js.org', visits: 50 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 5 },
                  { domain: 'getbootstrap.com', visits: 19 },
                  { domain: 'npmjs.com', visits: 65 }],
        count: 200,
      },
      { date: '20161020',
        domains: [{ domain: 'learn.makerpass.com', visits: 35 },
                  { domain: 'repl.it', visits: 12 },
                  { domain: 'haveibeenpwned.com', visits: 12 },
                  { domain: 'redux.js.org', visits: 13 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 19 },
                  { domain: 'getbootstrap.com', visits: 10 },
                  { domain: 'npmjs.com', visits: 40 }],
        count: 141,
      },
      { date: '20161021',
        domains: [{ domain: 'learn.makerpass.com', visits: 250 },
                  { domain: 'repl.it', visits: 50 },
                  { domain: 'haveibeenpwned.com', visits: 5 },
                  { domain: 'redux.js.org', visits: 5 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 5 },
                  { domain: 'getbootstrap.com', visits: 5 },
                  { domain: 'npmjs.com', visits: 1 }],
        count: 321,
      },
      { date: '20161022',
        domains: [{ domain: 'learn.makerpass.com', visits: 45 },
                  { domain: 'repl.it', visits: 20 },
                  { domain: 'haveibeenpwned.com', visits: 10 },
                  { domain: 'redux.js.org', visits: 15 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 20 },
                  { domain: 'getbootstrap.com', visits: 17 },
                  { domain: 'npmjs.com', visits: 10 }],
        count: 137,
      },
      { date: '20161023',
        domains: [{ domain: 'learn.makerpass.com', visits: 200 },
                  { domain: 'repl.it', visits: 44 },
                  { domain: 'haveibeenpwned.com', visits: 38 },
                  { domain: 'redux.js.org', visits: 50 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 4 },
                  { domain: 'getbootstrap.com', visits: 20 },
                  { domain: 'npmjs.com', visits: 10 }],
        count: 366,
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

    console.log('chart data', data);


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

    //AGGREGATE TOTAL VISIT COUNT FOR ALL DOMAINS FOR MAX AND MIN
    const findMin = (domains) => {
      let minValues = [];
      for (const domain of domains) {
        minValues.push(domain.visits);
      }
      return Math.min(...minValues);
    }



    let totalDomainCount = [];
    let dates = [];
    for (const day of data) {
      totalDomainCount.push(day.count);
      dates.push(new Date(day.date.slice(0, 4), day.date.slice(4, 6), day.date.slice(6)));
      for (const domain of day.domains) {
        totalDomainCount.push(domain.visits);
      }
    }


    //MAX AND MIN VALUES FOR Y AXIS
    const max = Math.max(...totalDomainCount);
    const min = Math.min(...totalDomainCount);


    const allDomainsdata = [];
    for (let i = 0; i < totalDomainCount.length; i++) {
      allDomainsdata.push({ count: totalDomainCount[i], date: dates[i] });
    }

    console.log('allDomainsdata', allDomainsdata);

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

    const makerPass = lineDataGenerator(data, 'learn.makerpass.com');

    console.log('makerpass data', makerPass);


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
       .attr("d", line(makerPass))
       .attr("stroke", "red")
       .attr("stroke-width", 2)
       .attr("fill", "none")



  }

  render() {

    return (
      <svg width="960" height="500"></svg>
    );

  }

}

 // <div ref={'hello'} style={{ margin: 'auto' }} />
