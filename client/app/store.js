'use strict';

import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import visData from './reducers/history';
import catData from './reducers/catData';



import { loadState } from './chrome/storage';

const persistedState = loadState();

const createStoreWithMiddleware = applyMiddleware(
  ReduxThunk
)(createStore);

let reducers = combineReducers({
  visData,
  catData
})


const store = createStoreWithMiddleware(reducers, persistedState);

export default store;
