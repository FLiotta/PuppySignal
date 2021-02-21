// @Project
import { BackendResponse } from 'interfaces/app';
import { Pet } from 'interfaces/pet';
import ProfileService from 'services/ProfileService';

export const FETCH_PETS: string = '[MY PETS] Fetch pets';
export const ADD_NEW_PET: string = '[MY PETS] Add new pet';

export const fetchPets = () => {
  return (dispatch: any) => ProfileService.pets()
    .then((response: BackendResponse) => {
      dispatch({
        type: FETCH_PETS,
        payload: response.data
      });
    })
    .catch((e: any) => { });
};

export const addNewPet = (newPet: Partial<Pet>) => ({
  type: ADD_NEW_PET,
  payload: newPet
});