// @Packages
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies, { Cookie } from 'universal-cookie';

// @Project
import { API_PATH } from 'config';

class ApiService {
  http: AxiosInstance;
  httpConfig: any;
  cookies: Cookie;
  token: string | undefined;

  constructor() {
    this.httpConfig = {
      baseURL: API_PATH,
      headers: {}
    };
    this.cookies = new Cookies();
    this.token = this.cookies.get('token');

    if(this.token) {
      this.httpConfig['headers']['token'] = this.token;
    };

    this.http = axios.create(this.httpConfig);
  }

  get(path: string, params: any = {}): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.http.get(path, params)
        .then((res: any) => resolve(res.data))
        .catch((e: any) => reject(e));
    })
  }

  post(path: string, body: any = {}, config: any = {}): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.http.post(path, body, config)
        .then((res: any) => resolve(res.data))
        .catch((e: any) => reject(e));
    })
  }
};

export default ApiService;