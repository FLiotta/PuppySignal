import { FETCH_SPECIES } from 'actions/species';

interface IState {
  results: any[]
  total: number
}

const defaultState: IState = {
  results: [],
  total: 0
};

export default (state = defaultState, action: any) => {
  switch(action.type) {
    case FETCH_SPECIES:
      return {
        ...state,
        results: action.payload
      };
    default:
      return state;
  };
};