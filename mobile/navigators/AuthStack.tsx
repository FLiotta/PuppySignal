// @Packages
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// @Project
import Login from 'views/Login';

// @Own
import { COLORS } from 'styles';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default AuthStack;