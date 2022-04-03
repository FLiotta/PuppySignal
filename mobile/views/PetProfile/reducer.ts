// @Packages
import { AnyAction } from 'redux'

// @Project
import { IPet } from "interfaces";

// @Own
import { 
  GET_PET,
  OPEN_DELETE_PET_MODAL,
  CLOSE_DELETE_PET_MODAL,
} from './actions'

export interface IPetProfileState {
  pet?: IPet,
  deleteModalOpen: boolean,
  editModalOpen: boolean,
}

const defaultState: IPetProfileState = {
  pet: undefined,
  editModalOpen: false,
  deleteModalOpen: false
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GET_PET:
      return {
        ...state,
        pet: action.payload
      };
    case OPEN_DELETE_PET_MODAL:
      return {
        ...state,
        deleteModalOpen: true,
      }
    case CLOSE_DELETE_PET_MODAL:
      return {
        ...state,
        deleteModalOpen: false,
      }
    default:
      return state;
  }
}