// @Project
import { IScanPetResponse } from 'interfaces/pet';

// @Own
import { http } from "./httpclient";

export const scanQR = (code: string) => {
    return http.get<IScanPetResponse>(`/scan/${code}`);
}