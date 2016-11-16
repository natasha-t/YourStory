'use strict';

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import historyReducer from './reducers';
import { loadState } from './chrome/storage';

const persistedState = loadState();

const createStoreWithMiddleware = applyMiddleware(
  ReduxThunk
)(createStore);

const store = createStoreWithMiddleware(historyReducer, persistedState);

export default store;
