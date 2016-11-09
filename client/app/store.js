import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk'
import historyReducer from './reducers';


const createStoreWithMiddleware = applyMiddleware(
  ReduxThunk
)(createStore);

const store = createStoreWithMiddleware(historyReducer, { visData: 'hello' });

export default store;

