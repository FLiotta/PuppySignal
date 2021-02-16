import { SIGN_IN, SIGN_UP, RECONNECT, LOGOUT} from '../actions/session';

const defaultState: any = {}

export default (state = defaultState, action: any) => {
  switch(action.type) {
    case SIGN_IN:
    case SIGN_UP:
    case RECONNECT:
      return action.payload;
    case LOGOUT:
      return defaultState;
    default:
      return state;
  };
}