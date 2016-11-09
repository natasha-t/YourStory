import React from 'react';
import {connect} from 'react-redux';
import store from '../store';

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class App extends React.Component {
  render() {
    const { visData } = this.props;
    return (
      <div>
       Hello World from app.jsx
       {visData}
      </div>
    );
  }
}
