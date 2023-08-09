export interface IOwner {
  email: string
  first_name: string
  last_name: string
  id: number
  profile_picture: string,
  updated_at: Date
  created_at: Date
  uuid: string,
  phone_number?: number;
}

export interface IPet {
  uuid: string;
  id: number;
  name: string;
  specie_id: number;
  extra?: string;
  profile_picture: string;
  owners: IOwner[]
}