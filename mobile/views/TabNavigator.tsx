// @Packages
import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Image } from 'react-native';

// @Projects
import FallbackColor from '../assets/fallback.png';
import { useGetProfileQuery } from '../api/profile';
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from '../styles';

// @Own
import HomeView from './Home';
import PetStack, { PetStackParamList } from './PetStack';
import ProfileStack, { ProfileStackParamList } from './ProfileStack';

export type RootStackParamList = {
  Home: undefined
  PetStack: NavigatorScreenParams<PetStackParamList>
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>
};

const Tab = createBottomTabNavigator<RootStackParamList>()

const TabNavigator: React.FC = () => {
  const { data: profile } = useGetProfileQuery();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={'Home'}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            let iconName = '';
            let color = focused ? PRIMARY_COLOR : PRIMARY_COLOR_LIGHT;

            switch (route.name) {
              case 'Home':
                iconName = 'house-chimney';
                break;
              case 'PetStack':
                iconName = 'paw';
                break
            }

            return <FontAwesome6 name={iconName} size={size} color={color} />
          },
          tabBarStyle: {
            elevation: 0,
            height: 60,
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name={'Home'} component={HomeView} />
        <Tab.Screen name={'PetStack'} component={PetStack} />
        <Tab.Screen
          name={'ProfileStack'}
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  source={
                    profile
                      ? { uri: profile.profile_picture }
                      : FallbackColor
                  }
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 32,
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? PRIMARY_COLOR : '#fff'
                  }}
                />
              )
            }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default TabNavigator;
