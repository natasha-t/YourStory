import React from 'react';

export default class OptionsList extends React.Component {
  render() {
    return (
      <option value={this.props.domain}>
        {this.props.domain}
      </option>
    )
  }
}
