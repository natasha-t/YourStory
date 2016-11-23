'use strict';

function username(state={}, action) {
  switch (action.type) {
    case 'FETCH_USERNAME': {
      return action.payload.data;
      break;
    }
  }
  return state;
}

export default username;