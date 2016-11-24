' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import Graph from './graph';
import DomainList from './domainList';

@connect((store) => { 
  console.log("store from graph list",store)
  return {
    weekData: store.weekData,
  };
})

export default class GraphList extends React.Component {
  constructor(props) {
    super(props);
    console.log("this.props.list", this.props);
    this.state = {
      selectValue: this.props.weekData,
    }
    console.log("STATE from GraphList", this.state);
  }

  graphChange(graphValue) {
    console.log("graphValue", graphValue);
    this.setState({
      selectValue: graphValue,
    });
    console.log("graphValue after changing state", this.state);
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
          <Graph />
        </div>
      </div>
    );
  }
}
