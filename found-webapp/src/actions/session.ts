// @Packages
import jwtDecode from 'jwt-decode';
import Cookie from 'universal-cookie';

// @Project
import { BackendResponse } from '../interfaces/app';
import AuthService from '../services/AuthService';

// @Initialization
const cookie = new Cookie();

export const SIGN_IN: string = '[SESSION] SIGN IN';
export const SIGN_UP: string = '[SESSION] SIGN UP';
export const RECONNECT: string = '[SESSION] RECONNECT';
export const LOGOUT: string = '[SESSION] LOGOUT';

export const signIn: Function = (email: string, password: string): any => {
  return (dispatch: any) => AuthService.signIn(email, password)
    .then((response: BackendResponse) => {
      const { token } = response.data;

      cookie.set('token', token);

      dispatch({
        type: SIGN_IN,
        payload: jwtDecode(token)
      });
    })
    .catch((e: any) => {})
};

export const signUp: Function = (email: string, password: string): any => {
  return (dispatch: any) => AuthService.signUp(email, password)
    .then((response: BackendResponse) => {
      const { token } = response.data;

      cookie.set('token', token);

      dispatch({
        type: SIGN_UP,
        payload: jwtDecode(token)
      });
    })
    .catch((e: any) => {})
};

export const reconnect: Function = (token: string): any => {
  return (dispatch: any): Promise<any> => {
    return new Promise((res, rej) => {
      const payload: any = jwtDecode(token);
      const actualEpochTime = Math.round(new Date().getTime() / 1000);
  
      const isTokenExpired = payload.exp < actualEpochTime;
  
      if(isTokenExpired) {
        rej('Expired token');
      } else {
        dispatch({
          type: RECONNECT,
          payload
        });

        res(payload);
      }
    });
  }
}

export const logout: Function = (): any => ({
  type: LOGOUT
});