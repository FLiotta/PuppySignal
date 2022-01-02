// @Project
import { AxiosPromise } from 'axios'
import { ServiceResponse, ISpecie } from 'interfaces'

// @Own
import http from './http'

export const getSpecies = (): AxiosPromise<ServiceResponse<ISpecie[]>> => {
  return http.get('/data/species');
}