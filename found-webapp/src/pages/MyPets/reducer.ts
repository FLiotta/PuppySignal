// @Own
import { FETCH_PETS, ADD_NEW_PET} from './actions';

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
    case ADD_NEW_PET:
      return {
        ...state,
        pets: [...state.pets, action.payload]
      };
    default:
      return state;
  }
};