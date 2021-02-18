// @Packages
import { AxiosResponse } from 'axios';

// @Project
import ApiService from './ApiService';

class PetService extends ApiService {
  getPetById(petId: number | undefined, params: any): Promise<AxiosResponse> {
    return this.get(`/pet/${petId}`, { params });
  }

  scanned(petId: number | undefined): Promise<AxiosResponse> {
    return this.get(`/pet/scanned/${petId}`);
  }
}

export default new PetService();