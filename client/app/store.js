import { createStore } from 'redux';
import combineReducers from './reducers';

export default createStore(combineReducers);
