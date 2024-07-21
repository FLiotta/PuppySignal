// @ Package
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// @ Project
import ProfileView from "./Profile";
import ProfileEditView from "./ProfileEdit";
import { BG_GRAY, PRIMARY_COLOR } from "../styles";


export type ProfileStackParamList = {
  Profile: undefined,
  ProfileEdit: undefined
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileView}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditView}
        options={{
          headerStyle: {
            backgroundColor: BG_GRAY
          },
          headerShadowVisible: false,
          headerTintColor: PRIMARY_COLOR,
          title: 'Profile Edit',
        }}
      />
    </Stack.Navigator>
  )
}

export default ProfileStack;
