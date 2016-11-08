import React from 'react';
import { connect } from 'react-redux';

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class App extends React.Component {
  render() {
    return
    <div>
      {this.props}
    </div>
  }
}
