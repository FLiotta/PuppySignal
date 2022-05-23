// @Packages
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging'

// @Project
import { selectSessionPhoneValidated, selectSessionTokens } from 'selectors/session';
import AuthStack from 'navigators/AuthStack';
import TabNavigator from 'navigators/TabNavigator';
import Loading from 'views/Loading'
import PhoneValidation from 'views/PhoneValidation';
import { suscribeToNotifications, unsuscribeToNotifications } from 'services/notifications';

// @Own
import store from './store'
import { name as appName } from './app.json';
import { refreshSessionToken } from 'actions/session';
import { IThunkDispatcher } from 'interfaces';
import { fetchSpecies } from 'actions/app';

const App: React.FC<any> = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  const tokens = useSelector(selectSessionTokens)
  const phoneValidated = useSelector(selectSessionPhoneValidated)
  const dispatch: IThunkDispatcher = useDispatch()

  useEffect(() => {
    dispatch(fetchSpecies());

    AsyncStorage.getItem('authentication_tokens')
      .then((storage_tokens) => {
        if (!storage_tokens) throw new Error("No previous token")
        
        const tokens = JSON.parse(storage_tokens)

        if (!tokens?.refresh_token) throw new Error("No previous token")
        
        dispatch(refreshSessionToken())
          .finally(() => setLoading(false))
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    async function validateFCMToken() {
      if(!tokens.access_token_payload?.uuid) {
        // Not logged yet
      }

      console.log("Checkeando si el token cambio al inicio.")
  
      const newFcmToken = await messaging().getToken();
      const oldFcmToken = await AsyncStorage.getItem("fcmToken");

      if (!oldFcmToken) {
        // Somehow FCM Token is not registered after auth
        console.error("Somehow FCM Token is not registered after auth")
        return
      }
      
      if (newFcmToken != oldFcmToken) {
        // FCM Token have changed
        await unsuscribeToNotifications(oldFcmToken);
        await suscribeToNotifications(newFcmToken);
        await AsyncStorage.setItem("fcmToken", newFcmToken);
      }
    }
        
    validateFCMToken();
    
    messaging().onTokenRefresh(async (newFCMToken) => {
      const oldFcmToken = await AsyncStorage.getItem("fcmToken");

      if(oldFcmToken) {
        await unsuscribeToNotifications(oldFcmToken);
      }
  
      await suscribeToNotifications(newFCMToken);
      await AsyncStorage.setItem("fcmToken", newFCMToken);
    })
  }, [tokens]);

  if (loading) return <Loading />

  return (
    <NavigationContainer>
      {
        tokens.access_token 
          ? phoneValidated
            ? <TabNavigator />
            : <PhoneValidation />
          : <AuthStack />
      }
      <Toast />
    </NavigationContainer>
  )
}

const EntryPoint: React.FC<any> = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  )
}

AppRegistry.registerComponent(appName, () => EntryPoint);
