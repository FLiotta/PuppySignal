// @Packages
import { AnyAction } from 'redux'

// @Project
import { IPet } from "interfaces";

// @Own
import { ADD_NEW_PET, GET_PETS } from './actions'

export interface IMyPetsState {
  pets: IPet[]
}

const defaultState: IMyPetsState = {
  pets: []
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GET_PETS:
      return {
        pets: action.payload
      };
    case ADD_NEW_PET:
      return {
        pets: [...state.pets, action.payload]
      }
    default:
      return state;
  }
}