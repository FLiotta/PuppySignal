// @Packages
import { AxiosResponse } from 'axios';

// @Project
import ApiService from './ApiService';

class AuthService extends ApiService {
  signIn(email: string, password: string): Promise<AxiosResponse> {
    return this.post('/auth/sign-in', { email, password });
  }

  signUp(email: string, password: string): Promise<AxiosResponse> {
    return this.post('/auth/sign-up', { email, password });
  }
}

export default new AuthService();