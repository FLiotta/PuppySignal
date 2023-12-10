// @Project
import { IScanPetResponse } from 'interfaces/pet';

// @Own
import { http } from "./httpclient";

export const scanQR = (code: string) => {
    return http.get<IScanPetResponse>(`/scan/${code}`);
}

export const shareLocation = (code: string, lat: number, lng: number) => {
    return http.post('/scan/location', { qr_code: code, lat, lng });
}