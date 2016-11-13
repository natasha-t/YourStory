import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import historyReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  ReduxThunk
)(createStore);

const store = createStoreWithMiddleware(historyReducer);

export default store;
