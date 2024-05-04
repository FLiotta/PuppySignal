// @Own
import api from './api';

interface IGoogleSignInResponse {
  access_token: string
  refresh_token: string
}

interface IRefreshTokenResponse {
  access_token: string
}

const authAPI = api.injectEndpoints({
  endpoints: (build) => ({
    logIn: build.query<IGoogleSignInResponse, string>({
      query: (token) => ({
        url: 'oauth/google',
        method: "POST",
        body: { token }
      })
    }),
    refresh: build.query<IRefreshTokenResponse, string>({
      query: (refresh_token, ) => ({
        url: 'oauth/jwt/refresh',
        method: "POST",
        body: { refresh_token }
      })
    }),
    deleteRefresh: build.query<void, string>({
      query: (refresh_token, ) => ({
        url: 'oauth/jwt/refresh',
        method: "DELETE",
        headers: { "refresh-token": refresh_token },
      })
    })
  })
})

export const { useLazyLogInQuery, useLazyRefreshQuery, useLazyDeleteRefreshQuery } = authAPI;
