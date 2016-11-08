import { createStore } from 'redux';
import historyReducer from './reducers';

export default createStore(historyReducer, {visData: 'hello'});
