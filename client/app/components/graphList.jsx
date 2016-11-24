' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import Graph from './graph';
import DomainList from './domainList';

@connect((store) => { 
  return {
    weekData: store.weekData,
  };
})

export default class GraphList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: this.props.list,
    }
    console.log("STATE from GraphList", props);
  }

  graphChange(graphValue) {
    console.log("graphValue", graphValue);

  }

  render() {    
    const uniqueDomains = [];
    let graphData = [];

    this.props.weekData.map((rawDayObj) => {
      rawDayObj['domains'].map((domain) => {
        let url = domain.domain;
        if ((uniqueDomains.indexOf(url)) === -1) {
          uniqueDomains.push(url);
        }
      });
    });
    graphData = [uniqueDomains, uniqueDomains, uniqueDomains];


    return (
      <div>
        <div className="graph-row">
          {graphData.map((domainList) =>
            <DomainList domain={domainList} getValue={this.graphChange.bind(this)}/>
          )}
          <br />
        </div>
        <div className="data-parent-container">
          <Graph domainName={graphValue}/>
        </div>
      </div>
    );
  }
}