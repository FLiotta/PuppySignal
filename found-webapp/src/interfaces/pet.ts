export interface Pet {
  uuid: string;
  id: number;
  name?: string;
  specie_id: number;
  extra?: string;
  token: string;
  profile_picture?: string;
}