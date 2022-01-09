// @Packages
import { AnyAction } from 'redux'

// @Project
import { GOOGLE_SIGN_IN, LOG_OUT, REFRESH_TOKEN } from 'actions/session';

export interface ISessionState {
  access_token?: string,
  refresh_token?: string
}

const defaultState: ISessionState = {
  access_token: undefined,
  refresh_token: undefined
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GOOGLE_SIGN_IN:
      return action.payload;
    case REFRESH_TOKEN:
      return action.payload;
    case LOG_OUT:
      return {
        access_token: undefined,
        refresh_token: undefined
      }
    default:
      return state;
  }
}