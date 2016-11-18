import React from 'react'
import { combineReducers } from 'redux'
import historyReducer from './history';
import catDataReducer from './catData';


export default combineReducers({
  historyReducer, catDataReducer
})

// export default historyReducer;