// @ Packages
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// @ Project
import appReducer from "./app.slice";
import api from './api/api';


const store = configureStore({
  reducer: {
    app: appReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(api.middleware)
  }
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export type IRootState = ReturnType<typeof store.getState>
export default store;
