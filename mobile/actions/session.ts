// @Packages
import AsyncStorage from '@react-native-async-storage/async-storage';

// @Project
import { IThunkDispatcher } from "interfaces";
import { googleAuth, refreshToken } from "services/auth";
import { getProfile, updateProfile } from 'services/profile';
import { unsuscribeToNotifications } from 'services/notifications';

export const GOOGLE_SIGN_IN = '[AUTH] GOOGLE'
export const REFRESH_TOKEN = '[AUTH] REFRESH TOKEN'
export const UPDATE_TOKENS = '[AUTH] UPDATE TOKENS'
export const LOG_OUT = '[AUTH] LOGOUT'

export const GET_PROFILE = '[PROFILE] GET'
export const UPDATE_PROFILE = '[PROFILE] UPDATE'

export const getUserProfile = () => {
  return (dispatch: IThunkDispatcher) => {
    return getProfile()
      .then((response) => {
        const data = response.data.data

        dispatch({
          type: GET_PROFILE,
          payload: data
        })
      })
      .catch((e) => console.log({ e }))
  }
}

export const updateUserProfile = (attrsToUpdate: any) => {
  return (dispatch: IThunkDispatcher) => {
    console.log("ABC")
    return updateProfile(attrsToUpdate)
      .then((response) => {
        console.log("@Llego aca")
        dispatch({
          type: UPDATE_PROFILE,
          payload: attrsToUpdate
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
}

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
      .catch((e) => console.log({ e }))
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
      .catch((e) => console.log({ e }))
  }
};

export const updateSessionTokens = (tokens: any)  => {
  AsyncStorage.setItem("authentication_tokens", JSON.stringify(tokens))

  return {
    type: UPDATE_TOKENS,
    payload: tokens
  }
};

export const logOut = (): any => {
  return async (dispatch: IThunkDispatcher) => {
    console.log("Logging out")
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log(fcmToken)
    if (fcmToken) {
      console.log("Eliminando token")
      await unsuscribeToNotifications(fcmToken)
    }
    console.log("Out")
    AsyncStorage.clear()
    
    dispatch({
      type: LOG_OUT
    })
  }
}
