'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { throttle } from 'lodash';
import App from './components/app';
import store from './store';
import { saveState } from './chrome/storage';

store.subscribe(() => {
  saveState(store.getState());
});

const app = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, app);

  console.log('env', process.env.HOST);

// need to figure out how to add throttle
// also really need to fix auth logic - i think it has to do with the bundling
