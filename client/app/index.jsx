'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';

console.log("env", process.env.HOST);

const app = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, app);
