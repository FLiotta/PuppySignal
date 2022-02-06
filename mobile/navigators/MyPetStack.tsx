// @Packages
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// @Project
import MyPets from 'views/MyPets';
import PetProfile from 'views/PetProfile';
import QRsPage from 'views/QRPage';
import PetLocations from 'views/PetLocations';
import PetCreate from 'views/CreateNewPet';
import Camera from 'views/Camera';

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
      <Stack.Screen
        name="QRsPage"
        component={QRsPage}
        options={{
          headerTransparent: true,
          title: "Pet's QR Codes",
          headerTintColor: COLORS.primary_color,
        }}
      />
      <Stack.Screen
        name="PetLocations"
        component={PetLocations}
        options={{
          headerTransparent: true,
          title: "Pet's Locations",
          headerTintColor: COLORS.primary_color,
        }}
      />
      <Stack.Screen
        name="PetCreate"
        component={PetCreate}
        options={{
          headerTransparent: true,
          title: "New Pet",
          headerTintColor: COLORS.primary_color,
        }}
      />
      <Stack.Screen
        name="Camera"
        component={Camera}
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