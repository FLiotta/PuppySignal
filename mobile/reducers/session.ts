// @Packages
import { AnyAction } from 'redux'
import jwtDecode from 'jwt-decode';

// @Project
import { 
  GOOGLE_SIGN_IN, 
  LOG_OUT, 
  REFRESH_TOKEN,
  UPDATE_TOKENS,
  GET_PROFILE,
  UPDATE_PROFILE
} from 'actions/session';
import { IUser, AccessTokenPayload } from 'interfaces';

export interface ISessionState {
  auth: {
    access_token?: string,
    refresh_token?: string
    access_token_payload?: AccessTokenPayload
  },
  profile: Partial<IUser>
}

const defaultState: ISessionState = {
  auth: {
    access_token: undefined,
    refresh_token: undefined
  },
  profile: {
    id: undefined,
    uuid: undefined,
    first_name: undefined,
    last_name: undefined,
    email: undefined,
    profile_picture: undefined,
    phone_number: undefined,
    phone_verified: undefined
  }
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GOOGLE_SIGN_IN:
      return {
        ...state,
        auth: {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
          access_token_payload: jwtDecode(action.payload.access_token)
        }
      }
    case REFRESH_TOKEN:
      return {
        ...state,
        auth: {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
          access_token_payload: jwtDecode(action.payload.access_token)
        }
      }
    case UPDATE_TOKENS:
      return {
        ...state,
        auth: {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
          access_token_payload: jwtDecode(action.payload.access_token)
        }
      }
    case LOG_OUT:
      return defaultState;
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload
      }
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      }
    default:
      return state;
  }
}