'use strict';

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import History from './history';
import Categories from './catData';
import Graph from './graph';
import Container from './nav_container';
import getToken from '../chrome/auth';
import { Button } from 'react-bootstrap';
import Footer from './footer';

export default class App extends React.Component {

  componentWillMount() {
    getToken();
  }

  render() {
    return (
      <div>
        <Button>Click me!</Button>
        <Router history={hashHistory}>
          <Route path="/" component={Container}>
            <IndexRoute component={History} />
            <Route path="/categories" component={Categories} />
            <Route path="/history" component={History} />
            <Route path="/graph" component={Graph} />

          </Route>
        </Router>

        <center className="footer">
          <Footer />
        </center>
      </div>
    );
  }
}

      // <Router history={hashHistory}>
      //   <Route path="/" component={Container}>
      //     <IndexRoute component={History} />
      //     <Route path="/categories" component={Categories} />
      //     <Route path="/history" component={History} />
      //     <Route path="/graph" component={Graph} />

      //   </Route>
      // </Router>