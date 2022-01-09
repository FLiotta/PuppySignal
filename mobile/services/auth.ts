// @Project
import { AxiosPromise } from 'axios'
import { BackendResponse } from 'interfaces'

// @Own
import http from './http'

interface GoogleAuthResponse {
  access_token: string,
  refresh_token: string
}

interface RefreshTokenResponse {
  access_token: string,
  refresh_token: string
}

export const googleAuth = (token: string): AxiosPromise<BackendResponse<GoogleAuthResponse>> => {
  return http.post('/oauth/google', { token });
}

export const refreshToken = (token: string): AxiosPromise<BackendResponse<RefreshTokenResponse>> => {
  return http.post('/oauth/jwt/refresh', {}, {
    headers: {
      "refresh-token": token
    }
  });
}