// @Packages
import { AnyAction } from 'redux'

// @Project
import { IPet } from "interfaces";

// @Own
import { 
  ADD_NEW_PET, 
  GET_PETS,
  REMOVE_PET_BY_ID
} from './actions'

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
        ...state,
        pets: action.payload
      };
    case ADD_NEW_PET:
      return {
        ...state,
        pets: [...state.pets, action.payload]
      }
    case REMOVE_PET_BY_ID:
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id != action.payload)
      }
    default:
      return state;
  }
}