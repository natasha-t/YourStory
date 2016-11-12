import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import History from './history';
import Container from './nav_container';

@connect((store) => {
  return {
    visData: store.visData,
  };
})

export default class App extends React.Component {

  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={History} />
        </Route>
      </Router>
    );
  }
}
