'use strict';

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import GraphList from './graphlist';
import History from './history';
import Categories from './catData';
import Graph from './graph';
import getToken from '../chrome/auth';
import Footer from './footer';
// import Container from './nav_container';
// import { Button } from 'react-bootstrap';

export default class App extends React.Component {

  componentWillMount() {
    getToken();
  }

  render() {
    return (
      
      <div>

        <History />
        <GraphList />

        <center className="footer">
          <Footer />
        </center>
      </div>
    );
  }
}
        // <Button>Click me!</Button>
        // <Router history={hashHistory}>
        //   <Route path="/" component={Container}>
        //     <IndexRoute component={History} />
        //     <Route path="/categories" component={Categories} />
        //     <Route path="/history" component={History} />
        //     <Route path="/graph" component={Graph} />

        //   </Route>
        // </Router>
