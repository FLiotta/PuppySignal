// @Project
import { IThunkDispatcher } from 'interfaces';
import { getPet } from 'services/pet';

export const GET_PET = '[PET PROFILE] GET';
export const OPEN_DELETE_PET_MODAL = '[PET PROFILE] OPEN DELETE MODAL';
export const CLOSE_DELETE_PET_MODAL = '[PET PROFILE] CLOSE DELETE MODAL';

export const getPetProfile = (pet_id: number) => {
  return (dispatch: IThunkDispatcher) => {
    return getPet(pet_id)
      .then((response) => {
        const data = response.data.data;

        dispatch({
          type: GET_PET,
          payload: data
        })
      })
  }
}

export const openDeleteModal = () => ({
  type: OPEN_DELETE_PET_MODAL
})

export const closeDeleteModal = () => ({
  type: CLOSE_DELETE_PET_MODAL
})