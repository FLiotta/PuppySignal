// @Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'; 

// @Project
import { suscribeToNotifications } from 'services/notifications';
import { googleSignIn } from 'actions/session';

// @Own
import styles from './styles'

const Login: React.FC = () => {
  GoogleSignin.configure({
    webClientId: process.env.googlewebclientid,
    offlineAccess: true,
  });

  const dispatch = useDispatch()

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      
      const { accessToken } = await GoogleSignin.getTokens();

      await dispatch(googleSignIn(accessToken))

      await handleNotificationSuscribe()
    } catch (error) {
      // TODO: Handle error.
      console.log(error)
    }
  };

  const handleNotificationSuscribe = async () => {
    try {
      const permissions = await messaging().hasPermission();

      if(!permissions) {
        await messaging().requestPermission();
      }

      let fcmToken = await AsyncStorage.getItem("fcmToken");

      if(!fcmToken) { 
        fcmToken = await messaging().getToken()
      }
    
      await AsyncStorage.setItem("fcmToken", fcmToken)

      await suscribeToNotifications(fcmToken);
    } catch(error) {
      AsyncStorage.removeItem("fcmToken");
      console.error({ 
        error_type: "push_notification",
        error_view: "auth",
        error: error
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>
          Welcome to PuppySignal
        </Text>
        <Text style={styles.description}>
          Track your pets with us!
        </Text>
        <GoogleSigninButton
          onPress={signInGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
        />
        <Text style={styles.descriptionTos}>* By creating an account you accept our ToS</Text>
        <Text style={styles.tos}>Terms of service</Text>
      </View>
    </View>
  )
}

export default Login;