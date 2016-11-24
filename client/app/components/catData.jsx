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

    // console.log('CAT DATA', this.props.catData);

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

    // console.log('cat data from catData.jsx', this.props.catData);

    // console.log('cat data from catData.jsx', this.props.catData);

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
    const colorArray =[
      'rgb(84, 135, 182)',
      'rgb(98, 140, 184)',
      // 'rgb(113, 144, 185)',
      // 'rgb(127, 149, 187)',
      // 'rgb(141, 154, 189)',
      'rgb(155, 159, 191)',
      'rgb(170, 163, 192)',
      // 'rgb(184, 168, 194)',
      // 'rgb(198, 173, 196)',
      // 'rgb(212, 178, 198)',
      'rgb(227, 182, 199)',
      'rgb(241, 187, 201)',
      'rgb(255, 192, 203)']
    const color = d3.scaleOrdinal(colorArray);
                                                       
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
        // .cornerRadius(8);

      let pie = d3.pie()
        .value(((d) => { return d.count; }))
        .sort(null);

      let tooltipD3 = d3.select('#chart')
        .append('div')
        .attr('class', 'tooltipD3');

      tooltipD3.append('div')
        .attr('class', 'label');

      tooltipD3.append('div')
        .attr('class', 'count');

      tooltipD3.append('div')
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
        // tooltipD3.select('.label').html(d.data.label);
        // tooltipD3.select('.count').html(d.data.count);
        // tooltipD3.select('.percent').html(percent + '%');
        // tooltipD3.style('display', 'block');
        svg.select('.domain').text(d.data.label + ': ' + percent + '%');
      }));

      path.on('mouseout', (() => {
        // tooltip.style('display', 'none');
        svg.selectAll('text').text("");
      }));

      path.on('click', d => {

        if(!d.data.domains){ console.log('Path.onClick: It should have been redirected'); return };

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
            var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
              return arc(interpolate(t));
            };
          });

        temp.exit()
          .remove();
      });


        let newLabel = svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('class', 'domain')
          .text("")
        newLabel.on('click', (() => {
          console.log('clicked')
        }));
  }

  render() {
    return (
      <div id="chart"></div>
    );
  }
}
