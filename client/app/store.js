import { createStore } from 'redux';
import allReducers from './reducers';

// export default createStore(allReducers);
export default createStore(allReducers, {
  visData: "hello from store.js!",
});
