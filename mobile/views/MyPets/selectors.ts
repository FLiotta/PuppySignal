import { IStoreState } from "reducers";

export const selectMyPetsPets = (state: IStoreState) => state.mypets.pets;