// @Project
import { BackendResponse } from 'interfaces/app';
import DataService from 'services/DataService';

export const FETCH_SPECIES: string = '[SPECIES] FETCH';

export const fetchSpecies: Function = () => {
  return (dispatch: any) => {
    return DataService.getAllSpecies()
      .then((response: BackendResponse) => {
        dispatch({
          type: FETCH_SPECIES,
          payload: response.data
        });
      })
      .catch(() => { });
  }
}