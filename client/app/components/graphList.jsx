' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import Graph from './graph';

@connect((store) => { 
  return {
    weekData: store.weekData,
  };
})

export default class GraphList extends React.Component {
  componentDidMount() {
    console.log("data from graphlist", this.props.weekData);
    const domainOptionsList = {};
    let graphData = [];

    const listItems = this.props.weekData.map((rawDayObj) => {
      rawDayObj['domains'].map((domain) => {
        // console.log("domains for listItems:", domain.domain);
        if(domainOptionsList[domain.domain] !== undefined){
          domainOptionsList[domain.domain]
        }
      });
    });

    console.log('domainOptionsList:', domainOptionsList);


      // <li>{ numbers }</li>   
  }

  render() {
    return (
      <div>
        <div className="graph-row">
          <select className="custom-select form-control form-control-sm">
            <option selected>Compare Website</option>
            <option value="1">google.com</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
          <br />
        </div>
        <div className="data-parent-container">
          <Graph />
        </div>
      </div>
    );
  }
}

