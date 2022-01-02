// @Project
import { AxiosPromise } from 'axios'
import { ServiceResponse } from 'interfaces'

// @Own
import http from './http'

interface GoogleAuthResponse {
  action_token: string,
  refresh_token: string
}

interface RefreshTokenResponse {
  action_token: string,
  refresh_token: string
}

export const googleAuth = (token: string): AxiosPromise<ServiceResponse<GoogleAuthResponse>> => {
  return http.post('/oauth/google', { token });
}

export const refreshToken = (token: string): AxiosPromise<ServiceResponse<RefreshTokenResponse>> => {
  return http.post('/oauth/refresh_token', { token });
}