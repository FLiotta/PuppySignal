// @Packages
import { AnyAction } from 'redux'

// @Project
import { GET_SPECIES } from 'actions/app';
import { ISpecie } from 'interfaces';

export interface IAppState {
  species: ISpecie[]
}

const defaultState: IAppState = {
  species: []
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GET_SPECIES:
      return {
        ...state,
        species: action.payload
      }
    default:
      return state;
  }
}