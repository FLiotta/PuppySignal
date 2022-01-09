// @Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'

// @Project
import { googleSignIn } from 'actions/session';

// @Own
import styles from './styles'

const Login: React.FC = () => {
  GoogleSignin.configure({
    webClientId: '1082575679142-9v99hb5kicdm795ht1b8oui3k0vr7jup.apps.googleusercontent.com',
    offlineAccess: true,
  });

  const dispatch = useDispatch()

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      
      const { accessToken } = await GoogleSignin.getTokens();
      
      dispatch(googleSignIn(accessToken))
    } catch (error) {
      // TODO: Handle error.
      console.log(error)
    }
  };

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