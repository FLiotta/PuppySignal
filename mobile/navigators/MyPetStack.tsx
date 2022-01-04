// @Packages
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// @Project
import MyPets from 'views/MyPets';
import PetProfile from 'views/PetProfile';

// @Own
import { COLORS } from 'styles';

const Stack = createStackNavigator();

const MyPetStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyPets" 
        component={MyPets} 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="PetProfile"
        component={PetProfile}
        options={{
          headerTransparent: true,
          title: '',
          headerTintColor: COLORS.primary_color,
        }}
      />
    </Stack.Navigator>
  )
}

export default MyPetStack;