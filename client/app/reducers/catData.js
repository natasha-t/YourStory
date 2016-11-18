'use strict';

function catData(state={}, action) {
  switch (action.type) {
    case 'FETCH_CAT_DATA': {
      return action.payload.data;
      break;
    }
  }
  return state;
}

export default catData;