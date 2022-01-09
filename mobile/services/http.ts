// @Packages
import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

// @Project
import config from '../config'

const requestInterceptor = async (config: any) => {
  const storage_tokens: string | null = await AsyncStorage.getItem('authentication_tokens')

  if(!storage_tokens) {
    return config
  }

  const tokens = JSON.parse(storage_tokens)
  
  if(!tokens?.access_token) {
    return config
  }

  config.headers.token = tokens.access_token
    
  return config
};

const http: AxiosInstance = axios.create({
    baseURL: config.API_URL
})

http.interceptors.request.use(requestInterceptor);

export default http;