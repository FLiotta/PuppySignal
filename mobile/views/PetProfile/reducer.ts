// @Packages
import { AnyAction } from 'redux'

// @Project
import { IPet } from "interfaces";

// @Own
import { GET_PET } from './actions'

export interface IPetProfileState {
  pet?: IPet
}

const defaultState: IPetProfileState = {
  pet: undefined
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GET_PET:
      return {
        ...state,
        pet: action.payload
      };
    default:
      return state;
  }
}