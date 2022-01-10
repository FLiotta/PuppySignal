// @Packages
import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt from 'jwt-decode'
import dayjs from 'dayjs'

// @Project
import store from '../store'
import { updateSessionTokens, logOut } from 'actions/session'
import { AccessTokenPayload, RefreshTokenPayload } from 'interfaces'
import config from '../config'

// @Own
import { refreshToken } from './auth'

const requestInterceptor = async (config: any) => {
  const storage_tokens: string | null = await AsyncStorage.getItem('authentication_tokens')

  if(!storage_tokens) {
    return config
  }

  const tokens = JSON.parse(storage_tokens)
  
  if(!tokens?.access_token || !tokens?.refresh_token) {
    return config
  }

  config.headers.token = tokens.access_token
    
  return config
};

const responseInterceptorOnError = async (error: any) => {
  // TODO: Loggear todo?
  const status = error.response ? error.response.status : null

  if(status == 403) {
    const storage_tokens: string | null = await AsyncStorage.getItem('authentication_tokens')

    if(!storage_tokens) {
      return Promise.reject(error);
    }

    const tokens = JSON.parse(storage_tokens)
    
    if(!tokens?.access_token || !tokens?.refresh_token) {
      return Promise.reject(error);
    }

    const refreshTokenPayload = jwt<RefreshTokenPayload>(tokens.refresh_token)
    const accessTokenPayload = jwt<AccessTokenPayload>(tokens.access_token)

    const refreshTokenExpired = refreshTokenPayload.exp - dayjs().unix() <= 0

    console.log({
      refresh: refreshTokenPayload.exp,
      now: dayjs().unix(),
      access: accessTokenPayload
    })

    if(refreshTokenExpired) {
      store.dispatch(logOut())

      return Promise.reject(error);
    }

    const response = await refreshToken(tokens.refresh_token)

    if(response.status == 200) {
      store.dispatch(updateSessionTokens(response.data.data))
      error.config.headers['token'] = response.data.data.access_token;

      return http.request(error.config);
    }    
  }

  return Promise.reject(error);
}

const http: AxiosInstance = axios.create({
    baseURL: config.API_URL
})

http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use((response) => response, responseInterceptorOnError)
export default http;