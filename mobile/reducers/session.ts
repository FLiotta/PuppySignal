// @Packages
import { AnyAction } from 'redux'

// @Project
import { 
  GOOGLE_SIGN_IN, 
  LOG_OUT, 
  REFRESH_TOKEN,
  UPDATE_TOKENS,
  GET_PROFILE,
  UPDATE_PROFILE
} from 'actions/session';
import { IUser } from 'interfaces';

export interface ISessionState {
  auth: {
    access_token?: string,
    refresh_token?: string
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
        auth: action.payload
      }
    case REFRESH_TOKEN:
      return {
        ...state,
        auth: action.payload
      }
    case UPDATE_TOKENS:
      return {
        ...state,
        auth: action.payload
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