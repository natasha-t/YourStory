'use strict';

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import History from './history';
import Categories from './catData';
import Chart from './chart';
import Container from './nav_container';
import getToken from '../chrome/auth';


export default class App extends React.Component {

  componentWillMount() {
    getToken();
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={History} />
          <Route path="/categories" component={Categories} />
          <Route path="/history" component={History} />
          <Route path="/chart" component={Chart} />

        </Route>
      </Router>
    );
  }
}
