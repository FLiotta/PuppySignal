import { IStoreState } from "reducers";

export const selectAppSpecies = (state: IStoreState) => state.app.species;