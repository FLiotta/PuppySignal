// @Packages
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import qs from 'query-string';
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from "@react-navigation/native"; 

// @Project
//import { setStatusBarColor, setStatusBarTranslucent } from '../../actions/app';
import Found from 'views/Found';
import { scanPetCode } from 'services/pet';
import Camera from 'components/Camera';
import { COLORS } from 'styles';

// @Own
import styles from './styles';

const Stack = createStackNavigator();

const Scan: React.FC<any> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const isFocus = useIsFocused();

  const onQrScan = (data: any) => {
    if(loading) {
      return;
    }

    setLoading(true);
    
    const parsed = qs.parseUrl(data.rawData);

    const { qr } = parsed.query as { qr: string };

    if(qr) {
      console.log(`QR ENCONTRADO ${qr}`)
      scanPetCode(qr)
        .then((resp) => {
          const data = resp.data.data;
          console.log(`MASCOTINHA ${data}`)
          Toast.show({
            type: 'success',
            text1: `It seems like you just found ${data.name}!`,
            text2: 'Get in contact with his owners and help him go back home ^^',
            position: 'top',
            visibilityTime: 4000
          })

          navigation.navigate('PetFound', { ...data });
        })
        .catch((e) => {
          console.log(e)
          Toast.show({
            type: 'error',
            text1: `There's something wrong with this QRCode`,
            text2: 'Maybe the owner deleted the pet from the app, or the QR is broken =(',
            position: 'top',
            visibilityTime: 4000
          })
        })
        .then(() => setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {isFocus && (
        <Camera 
          QrMode
          onQrScan={onQrScan}
          goBackControl
          onGoBackPress={navigation.goBack}
        />
      )}
    </View>
  )
}

const ScannerStack: React.FC<any> = (props) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Scanner"
      component={Scan}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="PetFound"
      component={Found}
      options={{
        headerTransparent: true,
        headerTitle: '', 
        headerTintColor: '#ffffff'
      }}
    />
  </Stack.Navigator>
);

export default ScannerStack;