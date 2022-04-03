// @Project
import { AxiosPromise, AxiosResponse } from 'axios'
import { BackendResponse, IPet, ICode, ILocation } from 'interfaces'

// @Own
import http from './http'

interface CreatePetBody {
  file: File,
  name: string,
  description: string,
  specie_id: number
}

export const createPet = (payload: CreatePetBody): AxiosPromise<BackendResponse<IPet>> => {
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

  return http.post('/pet/', bodyAsFormData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
}

export const getPet = (id: number): AxiosPromise<BackendResponse<IPet>> => {
  return http.get(`/pet/${id}`)
}

export const deletePet = (id: number): AxiosPromise<BackendResponse<null>> => {
  return http.delete(`/pet/${id}`)
}

export const getPetCodes = (id: number): AxiosPromise<BackendResponse<ICode[]>> => {
  return http.get(`/pet/${id}/codes`)
}

export const getPetLocations = (id: number): AxiosPromise<BackendResponse<ILocation[]>> => {
  return http.get(`/pet/${id}/locations`)
}

export const scanPetCode = (code: string): AxiosPromise<BackendResponse<IPet>> => {
  return http.get(`/pet/scanned/${code}`)
}