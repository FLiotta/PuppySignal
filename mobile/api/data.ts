// @Project
import { IBreed, ISpecie } from '../interfaces';

// @Own
import api from './api';


const dataAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getBreeds: build.query<IBreed[], number>({
      query: (specieId) => ({
        url: '/data/breeds',
        params: { specie_id: specieId }
      }),
      providesTags: ['Breeds']
    }),
    getSpecies: build.query<ISpecie[], void>({
      query: () => '/data/species',
      providesTags: ['Species'],
      keepUnusedDataFor: 3600 // This hardly changes.
    })
  })
})

export default dataAPI;
export const {
  useLazyGetBreedsQuery, 
  useLazyGetSpeciesQuery,
  useGetSpeciesQuery
} = dataAPI;