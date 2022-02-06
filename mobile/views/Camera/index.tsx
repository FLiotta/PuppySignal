// @Packages
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

// @Project
import Camera from '../../components/Camera';

const Stack = createStackNavigator();

interface IProps {
  navigation: StackNavigationProp<any, any>,
  route: any
}

const CameraPage: React.FC<IProps> = ({ navigation, route }) => {
  const {
    goBackControl,
    controlsVisible,
    handlePhotoTakes,
    QrMode,
    onQrScan
  } = route.params;

  return (
    <View style={styles.container}>
      <Camera 
        goBackControl={goBackControl}
        controlsVisible={controlsVisible}
        onPhotoTakes={handlePhotoTakes}
        onGoBackPress={navigation.goBack}
        QrMode={QrMode}
        onQrScan={onQrScan}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
});

export default CameraPage;