import { combineReducers } from 'redux'

import sessionState, { ISessionState } from './session'
import petProfileState, { IPetProfileState } from 'views/PetProfile/reducer'
import myPetsState, { IMyPetsState } from 'views/MyPets/reducer'
import appState, { IAppState } from './app'

export interface IStoreState {
  session: ISessionState,
  petprofile: IPetProfileState,
  mypets: IMyPetsState,
  app: IAppState
}

export default combineReducers<IStoreState>({
  session: sessionState,
  petprofile: petProfileState,
  mypets: myPetsState,
  app: appState
})