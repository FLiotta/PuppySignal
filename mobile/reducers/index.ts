import { combineReducers } from 'redux'

import sessionState, { ISessionState } from './session'

export interface IStoreState {
  session: ISessionState
}

export default combineReducers<IStoreState>({
  session: sessionState
})