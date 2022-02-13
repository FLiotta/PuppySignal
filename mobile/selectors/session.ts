import { IStoreState } from "reducers";

export const selectSessionTokens = (state: IStoreState) => state.session.auth
export const selectSessionProfile = (state: IStoreState) => state.session.profile
export const selectSessionPhoneValidated = (state: IStoreState) => state.session.auth.access_token_payload?.phone_verified
export const selectSessionTokenPayload = (state: IStoreState) => state.session.auth.access_token_payload