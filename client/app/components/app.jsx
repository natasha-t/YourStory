import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import History from './history';
import { Profile } from './detailed';
import Auth from './auth';
import Container from './nav_container';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

@connect((store) => {
  return {
    visData: store.visData
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={Auth} />
          <Route path="/history" component={History} />
        </Route>
      </Router>
    );
  }
}


{/* <div> */}
  {/* <Auth /> */}
  {/* <History /> */}
{/* // </div> */}
