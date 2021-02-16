// @Packages
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies, { Cookie } from 'universal-cookie';

class ApiService {
  http: AxiosInstance;
  httpConfig: any;
  cookies: Cookie;
  token: string | undefined;

  constructor() {
    this.httpConfig = {
      baseURL: 'http://localhost:4000/api',
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
    return this.http.get(path, params)
      .then((res: any) => res.data)
      .catch((e: any) => e);
  }

  post(path: string, body: any = {}, config: any = {}): Promise<AxiosResponse> {
    return this.http.post(path, body, config)
      .then((res: any) => res.data)
      .catch((e: any) => e);
  }
};

export default ApiService;