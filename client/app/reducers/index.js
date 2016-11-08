import React from 'react';
import {render} from 'react-dom';
import { combineReducers } from 'redux';
import { history } from './history';

import App from '../components/app.jsx';

// const anchor = document.createElement('div');
// anchor.id = 'yourstory-anchor';


export default combineReducers({
  history,
});
