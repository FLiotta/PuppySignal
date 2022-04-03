// @Project
import { IPet, IThunkDispatcher } from 'interfaces';
import { getProfilePets } from 'services/profile';

export const GET_PETS = '[MY PETS] GET';
export const ADD_NEW_PET = '[MY PETS] ADD NEW';
export const REMOVE_PET_BY_ID = '[MY PETS] REMOVE PET BY ID';

export const getPetsProfile = () => {
  return (dispatch: IThunkDispatcher) => {
    return getProfilePets()
      .then((response) => {
        const data = response.data.data;

        dispatch({
          type: GET_PETS,
          payload: data
        })
      })
  }
}

export const addNewPet = (pet: IPet) => ({
  type: ADD_NEW_PET,
  payload: pet
});

export const removePetById = (petId: number) => ({
  type: REMOVE_PET_BY_ID,
  payload: petId
})