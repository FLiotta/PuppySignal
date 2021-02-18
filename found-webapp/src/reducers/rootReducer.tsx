// @Packages
import { combineReducers } from 'redux';

// @Project
import session from './session';
import species from './species';
import mypets from '../pages/MyPets/reducer';

export default combineReducers({
  session,
  mypets,
  species
});