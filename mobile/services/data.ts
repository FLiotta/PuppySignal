// @Project
import { AxiosPromise } from 'axios'
import { BackendResponse, ISpecie } from 'interfaces'

// @Own
import http from './http'

export const getSpecies = (): AxiosPromise<BackendResponse<ISpecie[]>> => {
  return http.get('/data/species');
}