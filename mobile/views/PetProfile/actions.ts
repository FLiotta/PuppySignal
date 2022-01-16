// @Project
import { IThunkDispatcher } from 'interfaces';
import { getPet } from 'services/pet';

export const GET_PET = '[PET PROFILE] GET';

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