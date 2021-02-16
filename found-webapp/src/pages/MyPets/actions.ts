// @Project
import { BackendResponse } from '../../interfaces/app';
import ProfileService from '../../services/ProfileService';

export const FETCH_PETS: string = '[MY PETS] Fetch pets';

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