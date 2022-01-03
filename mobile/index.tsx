// @Packages
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {name as appName} from './app.json';

// @Project
import TabNavigator from 'navigators/TabNavigator';

const EntryPoint: React.FC<any> = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => EntryPoint);
