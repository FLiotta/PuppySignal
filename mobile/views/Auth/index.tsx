// @Packages
import { useState } from 'react';
import { Image, View, Text, PermissionsAndroid } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from 'react-native-config';

// @Project
import { useAppDispatch } from '../../store';
import { setAuthenticated } from '../../app.slice';
import Logo from '../../assets/logo.png';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../constants';
import { useLazySubscribeToPersonalTopicsQuery } from '../../api/notifications';
import { useLazyLogInQuery } from '../../api/auth';

// @Own
import styles from './styles';


GoogleSignin.configure({
  webClientId: config.GOOGLE_SIGN_IN_WEB_CLIENT_ID
});

const AuthView: React.FC = () => {
  const dispatch = useAppDispatch();

  const [triggerSignIn] = useLazyLogInQuery();
  const [triggerNotificationSuscribe] = useLazySubscribeToPersonalTopicsQuery()

  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      // 1. Request google sign in tokens
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()

      const googleSignInResponse = await GoogleSignin.getTokens()

      if (!googleSignInResponse.accessToken) {
        throw new Error("Cannot get Google's access token");
      }

      // 2. Login
      const authenticationResponse = await triggerSignIn(googleSignInResponse.accessToken).unwrap()

      // 3. Save tokens on async storage
      await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authenticationResponse.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, authenticationResponse.refresh_token);
    
      // 4. Set session 'authenticated' to true
      dispatch(setAuthenticated(true))

      // 5. Request push notifications permissions
      const notificationPermissions = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      )

      // 6. Get FCMToken in case its affirmative
      if (!notificationPermissions) {
        console.warn("User didn't approve notifications permissions");
        return 
      }

      const hasMessagingPermissions = await messaging().hasPermission()

      if (!hasMessagingPermissions) {
        console.warn("User didn't approve firebase messaging");
        return 
      }

      const FCMToken = await messaging().getToken()

      if (!FCMToken) {
        throw new Error("Cannot get FCM Token");
      }

      //7. Register user to its topics.
      await triggerNotificationSuscribe(FCMToken);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.name}>PuppySignal</Text>
      <View style={styles.googlesignin}>
        <GoogleSigninButton
          onPress={handleGoogleSignIn}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          disabled={loading}
          
        />
        <Text style={styles.footerText}>Get in contact with an administrator in case you face any technical issue.</Text>
      </View>
    </View>
  )
}

export default AuthView;