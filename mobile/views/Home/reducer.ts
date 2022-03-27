// @Packages
import { AnyAction } from 'redux'

// @Project
import { INotification } from "interfaces";

// @Own
import { GET_LAST_NOTIFICATIONS } from './actions'

export interface IHomeState {
  lastNotifications: INotification[]
}

const defaultState: IHomeState = {
  lastNotifications: []
}

export default (state = defaultState, action: AnyAction) => {
  switch(action.type) {
    case GET_LAST_NOTIFICATIONS:
      return {
        lastNotifications: action.payload
      };
    default:
      return state;
  }
}