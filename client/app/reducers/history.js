'use strict';

export default function(state={}, action) {
  switch(action.type) {
    case 'FETCH_VIS_DATA': {
      console.log('VIS DATA REDUCER: ', action.payload.data);
      return { ...state, visData: action.payload.data };
      break;
    }
  }

  return state;
}
