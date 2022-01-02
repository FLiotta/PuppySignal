import { AxiosPromise, AxiosResponse } from "axios";

export interface BackendResponse<T> {
  data: T,
  detail?: string
}

export interface ServiceResponse<T> extends AxiosPromise {
  data: BackendResponse<T>
}

export interface ISpecie {
  id: number,
  name: string
}

export interface IUser {
  id: number
  uuid: string
  first_name: string
  last_name: string
  email: string
  profile_picture?: string
  phone_number?: string
  phone_verified: boolean
}

export interface IPet {
  id: number
  uuid: string
  name: string
  profile_picture?: string
  extra?: string
  color?: string
  specie?: ISpecie
}

export interface INotification {
  id: number
  type: string
  pet: IPet
}

export interface ICode {
  id: number,
  code: string
}

export interface ILocation {
  id: number,
  latitude: string,
  longitude: string
}