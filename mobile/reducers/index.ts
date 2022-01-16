import { combineReducers } from 'redux'

import sessionState, { ISessionState } from './session'
import petProfileState, { IPetProfileState } from 'views/PetProfile/reducer'
import myPetsState, { IMyPetsState } from 'views/MyPets/reducer'

export interface IStoreState {
  session: ISessionState,
  petprofile: IPetProfileState,
  mypets: IMyPetsState
}

export default combineReducers<IStoreState>({
  session: sessionState,
  petprofile: petProfileState,
  mypets: myPetsState
})