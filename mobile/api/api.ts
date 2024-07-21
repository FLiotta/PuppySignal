// @ Packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from 'react-native-config';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

// @ Project
import { setAuthenticated } from '../app.slice';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../constants';

interface IRefreshTokenResponse {
  data: {
    access_token: string
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: config.API_URL,
  prepareHeaders: async (headers) => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!accessToken) {
      return
    }

    headers.set('token', accessToken);
  }
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const oldRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

    if(!oldRefreshToken) {
      api.dispatch(setAuthenticated(false));
      return result
    }

    const refreshResult = await baseQuery({
      url: config.API_URL + 'oauth/jwt/refresh',
      method: "POST",
      headers: {
        'refresh-token': oldRefreshToken
      }
    }, api, extraOptions)

    if (refreshResult.data) {
      const refreshResultResponse = refreshResult.data as IRefreshTokenResponse;

      const { access_token } = refreshResultResponse.data;

      // store the new token
      AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);

      // retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(setAuthenticated(false))
    }
  }
  return result;
}

const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Profile",
    "Notifications",
    "Pets",
    "Pet",
    "Codes",
    "Breeds",
    "Species",
    "Locations"
  ]
});

export default api;
