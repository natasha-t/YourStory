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
    const catParser = {
        "uncategorized": 'Others',
        "searchenginesandportals": 'Search Engines',
        "newsandmedia": 'News',
        "streamingmedia": 'Streaming Media',
        "entertainment": 'Entertainment',
        "shopping": 'Shopping',
        "vehicles": 'Vehicles',
        "gambling": 'Gambling',
        "informationtech": 'Technology',
        "games": 'Games',
        "sports": 'Sports',
        "economyandfinance": 'Economy & Finance',
        "jobrelated": 'Jobs & Career',
        "hacking": 'Hacking',
        "messageboardsandforums": 'Forums',
        "socialnetworking": 'Social Media',
        "chatandmessaging": 'Chat & Instant Messaging',
        "mediasharing": 'Media Sharing',
        "blogsandpersonal": 'Blogs',
        "health": 'Health',
        "adult": 'Adult Content',
        "personals": 'Dating',
        "religion": 'Religion',
        "travel": 'Travel',
        "abortion": 'Abortion',
        "education": 'Education',
        "drugs": 'Drugs',
        "alcoholandtobacco": 'Alcohol & Tobbaco',
        "business": 'Business',
        "advertising": 'Advertising',
        "humor": 'Humor',
        "foodandrecipes": 'Food & Recipes',
        "realestate": 'Real State',
        "weapons": 'Weapons',
        "proxyandfilteravoidance": 'Proxy & Filter Avoidance',
        "virtualreality": 'Virtual Reality',
        "translators": 'Translators',
        "parked": 'Parked Sites',
        "illegalcontent": 'Illegal Content',
        "contentserver": 'Content Servers'
    };

    const datasetCreator = ((data) => {
      return data.map((item) => {
        return { label: catParser[item.category], count: item.totalCount, domains: item.domains };
      });
    });

    let dataset = datasetCreator(this.props.catData);

    const width = 360;
    const height = 360;
    const radius = Math.min(width, height) / 2;
    const donutWidth = 55;  
    const legendRectSize = 18;                                  
    const legendSpacing = 4;                                                             
    const color = d3.scaleOrdinal(d3.schemeCategory20c);

    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2 ) + ')');

      const arc = d3.arc()
        .innerRadius(radius - donutWidth)             
        .outerRadius(radius)
        .padAngle(0.013)
        .cornerRadius(8);

      let pie = d3.pie()
        .value(((d) => { console.log('earlier d', d); return d.count; }))
        .sort(null);

      const tooltip = d3.select('#chart')
        .append('div')
        .attr('class', 'tooltip');

      tooltip.append('div')
        .attr('class', 'label');

      tooltip.append('div')
        .attr('class', 'count');

      tooltip.append('div')
        .attr('class', 'percent');

      let path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', ((d, i) => {
          return color(d.data.label);
        }));

      path.transition()
        .duration(2000)
        .attrTween('d', function(d) {
          var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
          return function(t) {
            return arc(interpolate(t));
          };
        });

      path.on('mouseover', ((d) => {
        const total = d3.sum(dataset.map((d) => {                
          return d.count;                                           
        }));
        const percent = Math.round(1000 * d.data.count / total) / 10;
        tooltip.select('.label').html(d.data.label);
        tooltip.select('.count').html(d.data.count);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
        if(!d.data.domains){
          legend.text('HELLO');
        }  
      }));

      path.on('mouseout', (() => {                              
        tooltip.style('display', 'none');                 
      }));

      path.on('click', d => {
        if(!d.data.domains){return};
        let temp = svg.selectAll('path')
        .data(pie(d.data.domains))

        temp
          .attr('d', arc)
          .attr('fill', ((d, i) => {
            return color(d.data.label);
          }))
          .transition()
          .duration(2000)
          .attrTween('d', function(d) {
            var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
            return function(t) {
              return arc(interpolate(t));
            };
          });

        temp.enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', ((d, i) => {
            return color(d.data.label);
          })).transition()
          .duration(2000)
          .attrTween('d', function(d) {
            var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
            return function(t) {
              return arc(interpolate(t));
            };
          });

        temp.exit()
          .remove();

        legend.remove();
      });

      let legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('transform', ((d, i) => {
        const height = legendRectSize + legendSpacing;
        const offset =  height * color.domain().length / 2;
        const horz = -3 * legendRectSize;
        const vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';        
      }));

      legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

      legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text((d) => { return d; });
  }

  render() {
    return (
      <div> 
        <div id="chart"></div>
      </div>
    );
  }
}