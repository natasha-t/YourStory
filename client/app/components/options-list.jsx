import React from 'react';

export default class OptionsList extends React.Component { //DUMB COMPONENT THAT ONLY RENDERS PROPS
  render() {
    return (
      <option value={this.props.domain}>
        {this.props.domain}
      </option>
    );
  }
}
