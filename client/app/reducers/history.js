export default function(state={}, action) {
  switch(action.type) {
    case 'FETCH_VIS_DATA': {
      console.log('listening for fetch vis data');
      return { ...state, visData: action.payload }
      break;
    }
  }

  return state;
}
