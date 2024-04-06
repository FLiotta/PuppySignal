export interface IAccessToken {
  id: number
  uuid: string
}

export interface IUser {
  id: number
  uuid: string
  first_name: string
  last_name: string
  email: string
  profile_picture?: string
  phone_number?: string
}

export interface ISpecie {
  id: number
  name: string
}

export interface IBreed {
  id: number
  name: string
}

export interface IPet {
  id: number
  uuid: string
  name: string
  profile_picture?: string
  description?: string
  specie: ISpecie
  breed: IBreed
  lost_since?: string
}

export type INotificationType = 'SCANNED' | 'NEW_LOCATION';

export interface INotification {
  id: number
  type: INotificationType,
  pet?: IPet
};

export interface IQRCode {
  id: number
  code: string
}

export interface ILocation {
  id: number,
  latitude: number,
  longitude: number,
  created_at: Date,
  updated_at: Date
}