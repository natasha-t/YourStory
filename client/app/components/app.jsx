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
        <div className="container-fluid">
          <br />
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-5">
                  <div >
                    [logo placeholder]
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="nav-greeting">
                    <span>Welcome back, <span>[username placeholder]</span> !</span> 
                  </div>
                </div>
                <div className="col-sm-1"></div>
              </div>
            </div>
          </div>
          <br />


          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12">
                  <center>
                    <label className="custom-control custom-radio">
                      <input id="radio1" name="radio" type="radio" className="custom-control-input" />
                      <span className="custom-control-indicator"></span>
                      <span className="custom-control-description">Graph View</span>
                    </label>
                    <label className="custom-control custom-radio">
                      <input id="radio2" name="radio" type="radio" className="custom-control-input" />
                      <span className="custom-control-indicator"></span>
                      <span className="custom-control-description">List View</span>
                    </label>
                  </center>
                </div>
              </div>
            </div>
          </div>
          <br />          

          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                  <h5>Sites Visited This Week</h5>
                  <GraphList />                  
                </div>
                <div className="col-sm-1"></div>
              </div>
            </div>
          </div>
          <br />
          <br />          

          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-5">
              <div className="row">
                <div className="col-sm-11">
                  <h5>Most Visited Sites</h5>
                  <div className="data-parent-container">
                    <History />
                  </div>
                </div>
                <div className="col-sm-1"></div>
              </div>
            </div>

            <div className="col-sm-5">
              <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-11">
                  <h5>Sites By Category</h5>
                  <div className="data-parent-container">
                    <Categories />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-1"></div>
          </div>
        </div>

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
