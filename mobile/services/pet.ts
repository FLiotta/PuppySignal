// @Project
import { AxiosPromise, AxiosResponse } from 'axios'
import { ServiceResponse, IPet, ICode, ILocation } from 'interfaces'

// @Own
import http from './http'

interface CreatePetBody {
  file: File,
  name: string,
  description: string,
  specie_id: number
}

export const createPet = (payload: CreatePetBody): AxiosPromise<ServiceResponse<IPet>> => {
  const bodyAsFormData = new FormData();

  for(const [key, value] of Object.entries(payload)) {

    if(key == 'file') {
      bodyAsFormData.append('file', {
        // @ts-ignore TODO: CHECK THIS
        uri: value,
        type: 'image/jpeg',
        name: 'file.jpeg'
      });
    } else {
      bodyAsFormData.append(key, value);
    }
  };

  return http.post('/pet', bodyAsFormData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
}

export const getPet = (id: number): AxiosPromise<ServiceResponse<IPet>> => {
  return http.get(`/pet/${id}`)
}

export const getPetCodes = (id: number): AxiosPromise<ServiceResponse<ICode[]>> => {
  return http.get(`/pet/${id}/codes`)
}

export const getPetLocations = (id: number): AxiosPromise<ServiceResponse<ILocation[]>> => {
  return http.get(`/pet/${id}/locations`)
}

export const scanPetCode = (code: string): AxiosPromise<ServiceResponse<IPet>> => {
  return http.get(`/pet/scanned/${code}`)
}