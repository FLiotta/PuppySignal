// @Project
import { IBackendResponse } from 'interfaces/app';
import { IPet } from 'interfaces/pet';

// @Own
import { http } from "./httpclient";

export const scanQR = (code: string) => {
    return http.get<IBackendResponse<IPet>>(`/pet/scanned/${code}`);
}