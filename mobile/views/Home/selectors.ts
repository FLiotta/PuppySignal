import { IStoreState } from "reducers";

export const selectLastNotifications = (state: IStoreState) => state.home.lastNotifications;