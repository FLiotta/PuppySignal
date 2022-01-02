import { AxiosPromise, AxiosResponse } from "axios";

export interface BackendResponse<T> {
  data: T,
  detail?: string
}

export interface ServiceResponse<T> extends AxiosPromise {
  data: BackendResponse<T>
}