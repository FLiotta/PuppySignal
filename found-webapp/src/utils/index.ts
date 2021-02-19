// @Project
import { FILE_STORAGE_PATH, DEFAULT_PET_AVATAR, DEFAULT_USER_AVATAR } from "config";

export const fetchPetImage: Function = (imageCode: string): string => {
  console.log(imageCode || 'asd')
  return FILE_STORAGE_PATH + '/pets/' + (imageCode || DEFAULT_PET_AVATAR);
}

export const fetchUserImage: Function = (imageCode: string): string => {
  return FILE_STORAGE_PATH + '/users/' + (imageCode || DEFAULT_USER_AVATAR);
}
