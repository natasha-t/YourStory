' use strict ';
import React from 'react';
import { connect } from 'react-redux';
import Graph from './graph';
import OptionsList from './options-list';

@connect((store) => { 
  return {
    weekData: store.weekData,
  };
})

export default class GraphList extends React.Component {
  componentDidMount() {
    // console.log("data from graphlist", this.props.weekData);
    // const uniqueDomains = [];
    // let graphData = [];

    // const allDomains = this.props.weekData.map((rawDayObj) => {
    //   rawDayObj['domains'].map((domain) => {
    //     let url = domain.domain;
    //     if ((uniqueDomains.indexOf(url)) === -1) {
    //       uniqueDomains.push(url);
    //     }
    //   });
    // });

    // const listItems = uniqueDomains.map((domain) => {
    //   <option>{ domain }</option>
    // });
  }

  render() {    
    const uniqueDomains = [];
    // let graphData = [];

    this.props.weekData.map((rawDayObj) => {
      rawDayObj['domains'].map((domain) => {
        let url = domain.domain;
        if ((uniqueDomains.indexOf(url)) === -1) {
          uniqueDomains.push(url);
        }
      });
    });

    return (
      <div>
        <div className="graph-row">
          <select className="custom-select form-control form-control-sm" value={this.props.sample} onChange={this.changeWebsite.bind(this)}>
            <option selected>Compare Website</option>            
            {uniqueDomains.map((domain) =>
              <OptionsList domain={domain} />
            )}
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

// <select className="custom-select form-control form-control-sm" value={this.props.sample} onChange={this.changeWebsite.bind(this)}>



