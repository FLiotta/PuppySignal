// @Project
import { AxiosPromise } from 'axios'
import { BackendResponse } from 'interfaces'

// @Own
import http from './http'

export const suscribeToNotifications = (fcmToken: string): AxiosPromise<BackendResponse<void>> => {
  return http.post('/notification/suscribe', { token: fcmToken });
}

export const unsuscribeToNotifications = (fcmToken: string): AxiosPromise<BackendResponse<void>> => {
  return http.post('/notification/unsuscribe', { token: fcmToken });
}
