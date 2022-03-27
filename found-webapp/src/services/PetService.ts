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

  getPetLocations(petId: number): Promise<AxiosResponse> {
    return this.get(`/pet/${petId}/locations`);
  }

  createPetLocation(petId: number, qr_code: string, lat: number, lng: number): Promise<AxiosResponse> {
    return this.post(`/pet/${petId}/locations`, { qr_code, lat, lng })
  }

  scanned(qr: string): Promise<AxiosResponse> {
    return this.get(`/pet/scanned/${qr}`);
  }
}

export default new PetService();