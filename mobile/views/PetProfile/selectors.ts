import { IStoreState } from "reducers";

export const selectPetProfile = (state: IStoreState) => state.petprofile.pet;