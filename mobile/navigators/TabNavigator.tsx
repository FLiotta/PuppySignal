// @Packages
import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @Project
import { COLORS } from 'styles';
import HomeScreen from 'views/Home';
import SettingsScreen from 'views/Settings';
import MyPetStack from './MyPetStack';

const Tab = createBottomTabNavigator();

const TabsNavigator: React.FC<any> = ({ navigation }) => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        elevation: 0,
        height: 60,
      },
      tabBarActiveTintColor: COLORS.primary_color,
      tabBarShowLabel: false,
    }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            if(focused) {
              color = COLORS.primary_color;
            } else {
              color = '#d1d1d1';
            }
            return <FontAwesome name="home" size={size} color={color}/>;
          }
        }}
      />
      <Tab.Screen 
        name="My Pets" 
        component={MyPetStack} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            if(focused) {
              color = COLORS.primary_color;
            } else {
              color = '#d1d1d1';
            }
            return <FontAwesome name="paw" size={size} color={color} />;
          }
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          tabBarVisible: false,
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => {
            if(focused) {
              color = COLORS.primary_color;
            } else {
              color = '#d1d1d1';
            }
            return <MaterialIcons name="qr-code-scanner" size={size} color={color} />;
          }
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => {
            if(focused) {
              color = COLORS.primary_color;
            } else {
              color = '#d1d1d1';
            }

            return (
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/00/2d/2c/002d2c77c221715e795e00298527b750.jpg"
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 32,
                  borderWidth: focused ? 2 : 0,
                  borderColor: focused ? COLORS.primary_color : '#fff'
                }}
              />
            )
          }
        })}
      />
    </Tab.Navigator>
  );
}

export default TabsNavigator;