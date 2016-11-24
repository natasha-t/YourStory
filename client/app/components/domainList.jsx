' use strict ';
import React from 'react';
import OptionsList from './options-list';

export default class DomainList extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'Compare Website',
    }
    console.log("STATE from DomainList", this.state);
  }

  changeWebsite(e) {
    this.setState({
      selectValue: e.target.value,
    });
    this.props.getValue(e.target.value);
  }

  render() {
    return (
      <select className="custom-select form-control form-control-sm" value={this.state.selectValue} onChange={this.changeWebsite.bind(this)}>
        <option selected>Compare Website</option>
        {this.props.domain.map((listItem) =>
          <OptionsList domain={listItem} />
        )}
      </select>
    );
  }
}
