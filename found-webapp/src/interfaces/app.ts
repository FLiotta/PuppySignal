export interface BackendResponse {
  code?: number,
  msg?: string,
  error?: any,
  data?: any,
};

export interface Specie {
  id: number,
  name: string
};