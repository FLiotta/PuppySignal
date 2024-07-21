// @Project
import { ILocation, IPet, IQRCode } from '../interfaces';

// @Own
import api from './api';


export interface ICreatePetArgs {
  name: string,
  specie_id: number,
  breed_id?: number,
  description: string,
  file: {
    uri: string,
    mime: string
  }
}

const petAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getPetById: build.query<IPet, { id: string | number }>({
      query: (args) => `/pet/${args.id}`,
      providesTags: ['Pet']
    }),
    getPetCodes: build.query<IQRCode[], { id: string | number }>({
      query: args => `/pet/${args.id}/codes`,
      providesTags: ['Codes']
    }),
    getPetLocations: build.query<ILocation[], string | number>({
      query: id => `/pet/${id}/locations`,
      providesTags: ['Locations']
    }),
    createPet: build.mutation<IPet, ICreatePetArgs>({
      query: args => {
        // https://stackoverflow.com/questions/76340703/send-form-data-with-rtk-query
        const bodyFormData = new FormData();

        bodyFormData.append('file', {
          uri: args.file.uri,
          name: 'foto.jpeg',
          type: args.file.mime,
        })
        bodyFormData.append('description', args.description);
        bodyFormData.append('name', args.name);
        bodyFormData.append('specie_id', args.specie_id);

        if (args.breed_id) {
          bodyFormData.append('breed_id', args.breed_id);
        }

        return {
          url: '/pet/',
          method: "POST",
          body: bodyFormData,
          formData: true
        }
      },
      invalidatesTags: ["Pets"]
    }),
    toggleLost: build.mutation<void, string | number>({
      query: id => {

        return {
          url: `/pet/${id}/lost`,
          method: 'PUT'
        };
      },
      invalidatesTags: ['Pet', 'Pets']
    })
  })
})

export default petAPI;
export const {
  useGetPetByIdQuery,
  useGetPetCodesQuery,
  useCreatePetMutation,
  useGetPetLocationsQuery,
  useToggleLostMutation
} = petAPI;
