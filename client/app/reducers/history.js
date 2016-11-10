export default function(state={}, action) {
  switch(action.type) {
    case 'FETCH_VIS_DATA': {
      console.log('action payload', action.payload)
      return { ...state, visData: action.payload }
      break;
    }
  }

  return state;
}
