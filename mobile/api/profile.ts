// @Project
import { INotification, IPet, IUser } from '../interfaces';

// @Own
import api from './api';


interface IGetPetsResponse {
  data: IPet[],
  total: number
}

interface IPagination {
  offset?: number
  limit?: number
}

interface IUpdateProfileMutation {
  first_name?: string,
  last_name?: string,
  phone_number?: string
}

const profileAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<IUser, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
      keepUnusedDataFor: 3600 // This hardly changes.
    }),
    updateProfile: build.mutation<void, IUpdateProfileMutation>({
      query: args => {
        return {
          url: '/profile',
          method: "PATCH",
          body: args
        }
      },
      invalidatesTags: ['Profile']
    }),
    getNotifications: build.query<INotification[], void>({
      query: () => '/profile/notifications',
      providesTags: ['Notifications']
    }),
    getPets: build.query<IGetPetsResponse, IPagination>({
      query: ({ limit = 5, offset = 0}) => {
        return {
          url: '/profile/pets',
          params: { limit, offset }
        }
      },
      providesTags: ['Pets'],
    })
  })
})

export default profileAPI;
export const {
  useGetProfileQuery, 
  useUpdateProfileMutation,
  useLazyGetProfileQuery,
  useGetNotificationsQuery,
  useGetPetsQuery
} = profileAPI;