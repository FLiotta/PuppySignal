// @Project
import { IThunkDispatcher } from 'interfaces';
import { getProfilePets } from 'services/profile';

export const GET_PETS = '[MY PETS] GET';

export const getPetsProfile = () => {
  return (dispatch: IThunkDispatcher) => {
    return getProfilePets()
      .then((response) => {
        const data = response.data.data;

        console.log("lloll", response.data.data)
        dispatch({
          type: GET_PETS,
          payload: data
        })
      })
  }
}