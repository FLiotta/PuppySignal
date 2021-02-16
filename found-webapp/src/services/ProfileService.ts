// @Packages
import { AxiosResponse } from 'axios';

// @Project
import ApiService from './ApiService'

class ProfileService extends ApiService {
  pets(): Promise<AxiosResponse> {
    return this.get('/profile/pets');
  }
}

export default new ProfileService();