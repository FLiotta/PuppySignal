// @Own
import { FETCH_PETS } from './actions';

const defaultState: any = {
  pets: []
};

export default (state = defaultState, action: any) => {
  switch(action.type) {
    case FETCH_PETS:
      return {
        ...state,
        pets: action.payload
      };
    default:
      return state;
  }
};