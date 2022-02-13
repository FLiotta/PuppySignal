// @Project
import { AxiosPromise, AxiosResponse } from 'axios'
import {
  BackendResponse,
  IUser,
  IPet,
  INotification
} from 'interfaces'

// @Own
import http from './http'

interface UpdateProfileBody {
  first_name?: string
  last_name?: string
  birthday?: string
}

export const getProfile = (): AxiosPromise<BackendResponse<IUser>> => {
  return http.get('/profile');
}

export const updateProfile = (payload: UpdateProfileBody): AxiosPromise<AxiosResponse<any>> => {
  return http.patch('/profile/', payload)
}

export const getProfilePets = (): AxiosPromise<BackendResponse<IPet[]>> => {
  return http.get('/profile/pets')
}

export const getProfileNotifications = (): AxiosPromise<BackendResponse<INotification[]>> => {
  return http.get('/profile/notifications')
}

export const requestPhoneNumberCode = (phone_number: string): AxiosPromise<AxiosResponse<any>> => {
  return http.post('/profile/phone_number', { phone_number })
}

export const validatePhoneNumberCode = (phone_number: string, code: string): AxiosPromise<AxiosResponse<any>> => {
  return http.post('/profile/phone_number/verify', { phone_number, code })
}