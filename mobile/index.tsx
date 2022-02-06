// @Packages
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { AppRegistry, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MenuProvider } from 'react-native-popup-menu';

// @Project
import { selectSessionTokens } from 'selectors/session';
import AuthStack from 'navigators/AuthStack';
import TabNavigator from 'navigators/TabNavigator';
import Loading from 'views/Loading'

// @Own
import store from './store'
import { name as appName } from './app.json';
import { refreshSessionToken } from 'actions/session';
import { IThunkDispatcher } from 'interfaces';
import { fetchSpecies } from 'actions/app';

const EntryPoint: React.FC<any> = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  )
}

const App: React.FC<any> = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  const tokens = useSelector(selectSessionTokens)
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

  if (loading) return <Loading />

  return (
    <NavigationContainer>
      {
        tokens.access_token ? <TabNavigator /> : <AuthStack />
      }
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => EntryPoint);
