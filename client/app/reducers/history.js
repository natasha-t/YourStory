'use strict';

function visData(state={}, action) {
  switch(action.type) {
    case 'FETCH_VIS_DATA': {
      return action.payload.data
      break;
    }
  }
  return state;
}

export default visData;