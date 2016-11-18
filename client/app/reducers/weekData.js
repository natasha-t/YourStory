'use strict';

function weekData(state={}, action) {
  switch (action.type) {
    case 'FETCH_WEEK_DATA': {
      return action.payload.data;
      break;
    }
  }
  return state;
}

export default weekData;