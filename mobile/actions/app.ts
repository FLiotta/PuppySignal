// @Project
import { IThunkDispatcher } from "interfaces";
import { getSpecies } from "services/data";

export const GET_SPECIES = '[APP] GET SPECIES'


export const fetchSpecies = () => {
  return (dispatch: IThunkDispatcher) => {
    return getSpecies()
      .then((response) => {
        const data = response.data.data
        
        console.log(data)

        dispatch({
          type: GET_SPECIES,
          payload: data
        })
      })
      .catch((e) => console.log({ e }))
  }
}