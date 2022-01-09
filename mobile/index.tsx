// @Packages
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { AppRegistry, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

// @Project
import { selectSessionTokens } from 'selectors/session';
import AuthStack from 'navigators/AuthStack';
import TabNavigator from 'navigators/TabNavigator';

// @Own
import store from './store'
import { name as appName } from './app.json';
import { refreshSessionToken } from 'actions/session';
import { IThunkDispatcher } from 'interfaces';

const EntryPoint: React.FC<any> = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const App: React.FC<any> = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  const tokens = useSelector(selectSessionTokens)
  const dispatch: IThunkDispatcher = useDispatch()

  useEffect(() => {
    AsyncStorage.getItem('authentication_tokens')
      .then((storage_tokens) => {
        if (!storage_tokens) return

        const tokens = JSON.parse(storage_tokens)

        if (!tokens?.refresh_token) return

        dispatch(refreshSessionToken())
          .then(() => {
            setLoading(false)
          })
          .catch(() => { 
            // DO NOTHING
          })
      })
  }, [])

  if (loading) return <></>

  return (
    <NavigationContainer>
      {
        tokens.access_token ? <TabNavigator /> : <AuthStack />
      }
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => EntryPoint);
