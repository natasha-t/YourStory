'use strict';

export default function (state={}, action) {
  switch (action.type) {
    case 'FETCH_CAT_DATA': {
      console.log('listened for categorized data payload: ', action.payload.data);
      return { ...state, catData: action.payload.data };
      break;
    }
  }
  return state;
}
