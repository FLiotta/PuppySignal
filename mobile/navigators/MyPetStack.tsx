// @Packages
import React from 'react';
import { View, Image, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

// @Project
import { COLORS } from 'styles';
import { IThunkDispatcher } from 'interfaces';
import MyPets from 'views/MyPets';
import PetProfile from 'views/PetProfile';
import QRsPage from 'views/QRPage';
import PetLocations from 'views/PetLocations';
import PetCreate from 'views/CreateNewPet';
import Camera from 'views/Camera';

// @Own
import { selectPetProfile } from 'views/PetProfile/selectors';
import { openDeleteModal } from 'views/PetProfile/actions';


const Stack = createStackNavigator();

const MyPetStack = () => {
  const currentPetProfile = useSelector(selectPetProfile)
  const dispatch: IThunkDispatcher = useDispatch()

  const handleOpenDeleteModal = () => {
    dispatch(openDeleteModal())
  }

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
          headerRightContainerStyle: {
            paddingRight: 20
          },
          headerTransparent: false,
          headerTintColor: COLORS.primary_color,
          headerTitle: () => (
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: currentPetProfile?.profile_picture
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 32,
                  borderWidth: 2,
                  borderColor: COLORS.primary_color,
                  marginRight: 15
                }}
              />
              <Text style={{ fontSize: 18, color: COLORS.primary_color}}>
                {currentPetProfile?.name}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
              <FontAwesome name="pencil" size={24} color={COLORS.primary_color} />
              <FontAwesome 
                name="trash-o" 
                size={24} 
                color={COLORS.primary_color} 
                style={{ marginLeft: 25 }} 
                onPress={handleOpenDeleteModal}
              />
            </View>
          )
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