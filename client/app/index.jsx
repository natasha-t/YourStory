import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import Auth from './components/auth';
import store from './store';

const app = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <Auth />
  </Provider>, app);

  // currently rendering AUTH component for testing.
  // will be updated with react routes
  // replace with APP component or HISTORY component for now
