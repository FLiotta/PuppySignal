// @Packages
import AsyncStorage from '@react-native-async-storage/async-storage'

// @Project
import { IThunkDispatcher } from "interfaces";
import { googleAuth, refreshToken } from "services/auth";

export const GOOGLE_SIGN_IN = '[AUTH] GOOGLE'
export const REFRESH_TOKEN = '[AUTH] REFRESH TOKEN'
export const LOG_OUT = '[AUTH] LOGOUT'

export const googleSignIn = (accessToken: string): any => {
  return (dispatch: IThunkDispatcher) => {
    return googleAuth(accessToken)
      .then((response) => {
        const data = response.data.data

        AsyncStorage.setItem("authentication_tokens", JSON.stringify(data))

        dispatch({
          type: GOOGLE_SIGN_IN,
          payload: data
        })
      })
  }
};

export const refreshSessionToken = ()  => {
  return async (dispatch: IThunkDispatcher) => {
    const storage_tokens: string | null = await AsyncStorage.getItem('authentication_tokens')

    if(!storage_tokens) {
      return null
    }

    const tokens = JSON.parse(storage_tokens)
    
    if(!tokens?.refresh_token) {
      return null
    }

    return refreshToken(tokens.refresh_token)
      .then((response) => {
        const data = response.data.data

        AsyncStorage.setItem("authentication_tokens", JSON.stringify(data))

        dispatch({
          type: REFRESH_TOKEN,
          payload: data
        })
      })
  }
};

export const logOut = (): any => {
  return (dispatch: IThunkDispatcher) => {
    AsyncStorage.clear()

     dispatch({
      type: LOG_OUT
    })
  }
}