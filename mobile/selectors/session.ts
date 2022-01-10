import { IStoreState } from "reducers";

export const selectSessionTokens = (state: IStoreState) => state.session.auth
export const selectSessionProfile = (state: IStoreState) => state.session.profile