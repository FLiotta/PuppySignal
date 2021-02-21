// @Project
import { FILE_STORAGE_PATH, DEFAULT_PET_AVATAR, DEFAULT_USER_AVATAR } from "config";

export const fetchPetImage: Function = (imageCode: string): string => {
  return FILE_STORAGE_PATH + '/pets/' + (imageCode || DEFAULT_PET_AVATAR);
}

export const fetchUserImage: Function = (imageCode: string): string => {
  return FILE_STORAGE_PATH + '/users/' + (imageCode || DEFAULT_USER_AVATAR);
}

export const downloadCanvasAsImage: Function = (
  querySelector: string,
  fileName: string = 'My QR',
  fileExtension: 'png' | 'jpg' | 'jpeg' = 'png'
) => {
  const canvas: any = document.querySelector(querySelector);
  const base64 = canvas.toDataURL();
  const hyper = document.createElement('a');
  hyper.href = base64;
  hyper.download = `${fileName}.${fileExtension}`;
  hyper.click();
  hyper.remove();
}