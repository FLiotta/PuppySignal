// @Packages
import { AxiosResponse } from 'axios';

// @Project
import ApiService from './ApiService';

class DataService extends ApiService {
  getAllSpecies(): Promise<AxiosResponse> {
    return this.get(`/data/species`);
  }
}

export default new DataService();