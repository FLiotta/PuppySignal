import { IStoreState } from "reducers";

export const selectPetProfile = (state: IStoreState) => state.petprofile.pet;
export const selectDeletePetModalVisibility = (state: IStoreState) => state.petprofile.deleteModalOpen;