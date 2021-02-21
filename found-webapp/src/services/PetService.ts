// @Packages
import { AxiosResponse } from 'axios';

// @Project
import ApiService from './ApiService';

interface AddNewPet {
  extra?: string;
  name: string;
  specie_id: string;
  profile_picture?: File,
  crop_details?: any
};

class PetService extends ApiService {
  addNewPet(petData: AddNewPet): Promise<AxiosResponse> {
    const bodyAsFormData = new FormData();

    for(const [key, value] of Object.entries(petData)) {
      bodyAsFormData.append(key, value);
    };

    return this.post(`/pet`, bodyAsFormData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
  };

  getPetById(petId: number | undefined, params: any): Promise<AxiosResponse> {
    return this.get(`/pet/${petId}`, { params });
  }

  scanned(petId: number, token: string): Promise<AxiosResponse> {
    return this.get(`/pet/scanned/${petId}`, {
      params: {
        token
      }
    });
  }
}

export default new PetService();