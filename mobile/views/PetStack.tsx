// @ Packages
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// @ Project
import { PRIMARY_COLOR, BG_GRAY } from "../styles";

// @ Own
import PetsView from "./Pets";
import PetProfileView from './PetProfile'
import PetCodesView from "./PetCodes";
import PetCreationView from "./PetCreation";
import PetLocationsView from "./PetLocations";


export type PetStackParamList = {
  MyPets: undefined,
  PetProfile: { id: number };
  PetCodes: { id: number };
  PetLocations: { id: number };
  PetCreation: undefined
};

const Stack = createNativeStackNavigator<PetStackParamList>();

const PetStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='MyPets'
        component={PetsView}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='PetProfile'
        component={PetProfileView}
        options={{
          headerStyle: {
            backgroundColor: BG_GRAY
          },
          headerShadowVisible: false,
          headerTintColor: PRIMARY_COLOR,
          title: '',
        }}
      />
      <Stack.Screen
        name='PetCodes'
        component={PetCodesView}
        options={{
          headerStyle: {
            backgroundColor: BG_GRAY
          },
          headerShadowVisible: false,
          headerTintColor: PRIMARY_COLOR,
          title: '',
        }}
      />
      <Stack.Screen
        name='PetLocations'
        component={PetLocationsView}
        options={{
          headerStyle: {
            backgroundColor: BG_GRAY
          },
          headerShadowVisible: false,
          headerTintColor: PRIMARY_COLOR,
          title: '',
        }}
      />
      <Stack.Screen
        name='PetCreation'
        component={PetCreationView}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: {
            backgroundColor: BG_GRAY
          },
          headerShadowVisible: false,
          title: '',
        }}
      />
    </Stack.Navigator>
  )
}

export default PetStack
