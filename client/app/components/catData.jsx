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

  componentDidMount() {
    console.log('compoennt dididi dduppddateee');
    // const data = this.props.catData;

    console.log(this.props.catData);

    const catParser = {
      'searchenginesandportals': 'Search Engines',
      'informationtech': 'Information Tech',
      'uncategorized': 'Others',
      'socialnetworking': 'Social Media',
      'streamingmedia': 'Streaming Media',
      'abortion': 'Abortion',
      'adultcontent': 'Adult Content',
      'advertising': 'Advertising',
      'alcoholandtobacco': 'Alcohol & Tobacco',
      'blogsandpersonalsites': 'Blogs',
      'business': 'Business',
      'chatandinstantmessaging': 'Chats & Instant Messaging',
      'contentservers': 'Content Servers',
      'datingandpersonals': 'Dating & Personals',
      'drugs': 'Drugs',
      'economyandfinance': 'Economy & Finance',
      'education': 'Education',
      'entertainment': 'Entertainment',
      'foodandrecipes': 'Food',
      'gambling': 'Gambling',
      'games': 'Games',
      'hackingandcracking': 'Hacking & Cracking',
      'health': 'Health',
      'humor': 'Humor',
      'illegalcontent': 'Illegal Content',
      'informationtechnology': 'Information Technology',
      'jobrelated': 'Career & Jobs',
      'jobsandcareers': 'Career & Jobs',
      'mediasharing': 'Media Sharing'
    };

    const datasetCreator = ((data) => {
      return data.map((item) => {
        return { label: catParser[item.category], count: item.totalCount };
      });
    });

    const dataset = datasetCreator(this.props.catData);

    console.log(dataset)

    const width = 360;
    const height = 360;
    const radius = Math.min(width, height) / 2;
    const donutWidth = 75;  
    var legendRectSize = 18;                                  // NEW
    var legendSpacing = 4;                                    // NEW                          // NEW
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

        const arc = d3.arc()
          .innerRadius(radius - donutWidth)             // UPDATED
          .outerRadius(radius)
          .padAngle(0.025)
          .cornerRadius(8);

        const pie = d3.pie()
          .value(function(d) { return d.count; })
          .sort(null);

        var tooltip = d3.select('#chart')
          .append('div')
          .attr('class', 'tooltip');                                    
        
        tooltip.append('div')
          .attr('class', 'label');                                      
        
        tooltip.append('div')
          .attr('class', 'count');                                      
        
        tooltip.append('div')
          .attr('class', 'percent');

        const path = svg.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(d.data.label);
          });

        path.on('mouseover', function(d) {                            // NEW
          var total = d3.sum(dataset.map(function(d) {                // NEW
            return d.count;                                           // NEW
          }));                                                        // NEW
          var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
          tooltip.select('.label').html(d.data.label);                // NEW
          tooltip.select('.count').html(d.data.count);                // NEW
          tooltip.select('.percent').html(percent + '%');             // NEW
          tooltip.style('display', 'block');                          // NEW
        });                                                           // NEW
        path.on('mouseout', function() {                              // NEW
          tooltip.style('display', 'none');                           // NEW
          });

        var legend = svg.selectAll('.legend')                     // NEW
          .data(color.domain())                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW
            var height = legendRectSize + legendSpacing;          // NEW
            var offset =  height * color.domain().length / 2;     // NEW
            var horz = -2 * legendRectSize;                       // NEW
            var vert = i * height - offset;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW
        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize)                         // NEW
          .style('fill', color)                                   // NEW
          .style('stroke', color);                                // NEW
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d) { return d; }); 

  //   var canvas = document.querySelector("canvas"),
  //       context = canvas.getContext("2d");

  //   var width = canvas.width,
  //       height = canvas.height,
  //       radius = Math.min(width, height) / 2;

  //   var colors = [
  //     "#1f77b4", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf", "#ff7f0e"
  //   ];

  //   var arc = d3.arc()
  //       .outerRadius(radius - 10)
  //       .innerRadius(radius - 70)
  //       .padAngle(0.03)
  //       .cornerRadius(8)
  //       .context(context);

  //  const pie = d3.pie();

  //  const arcs = pie.value(function(d) { return d.totalCount; })(data);

  //   context.translate(width / 2, height / 2);

  //   context.globalAlpha = 0.5;
  //   arcs.forEach(function(d, i) {
  //     context.beginPath();
  //     arc(d);
  //     context.fillStyle = colors[i];
  //     context.fill();
  //   });

  //   context.globalAlpha = 1;
  //   context.beginPath();
  //   arcs.forEach(arc);
  //   context.lineWidth = 1.5;
  //   context.stroke();
  }

  render() {
    return (
      <div> 
        <div id="chart"></div>
      </div>
    );
  }
}