// @Packages
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ImageEditor from '@react-native-community/image-editor';

// @Project
import { COLORS } from '../../styles';

interface IProps {
  onConfirm(imageUri: any): void
}

const Step1: React.FC<IProps> = ({ onConfirm }) => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<any>(null);

  const handlePhotoTakes = (photoData: any) => {
    const { uri, width, height } = photoData;

    const cropData = {
      offset: { x: 0, y: 0 },
      size: { width, height },
      displaySize: { width: 500, height: 500 },
    };
      
    ImageEditor.cropImage(uri, {...cropData})
      .then((croppedImage) => {
        setImageUri(croppedImage);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: `That's a really good one! ❤️😭📸`,
          visibilityTime: 2000,
          autoHide: true,
        });
      })
      .catch((e) => console.log({ e }))
  }

  const handleOpenCamera = () => {
    navigation.navigate('Camera', {
      controlsVisible: true,
      goBackControl: true,
      handlePhotoTakes: (data: any) => {
        handlePhotoTakes(data);
        navigation.goBack();
      }
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenCamera} style={styles.imageContainer}>
        {imageUri
          ? <Image source={{ uri: imageUri }} style={styles.image} />
          : <Text style={styles.imageContainerText}>Take a photo of your pet 🐶{'\n'} Press me to take a photo 📷!</Text>
        }
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={{
          width: '100%',
          alignItems: 'center',
        }}>
        </View>
        <Text style={styles.headerTitle}>
          Let first take a picture!
        </Text>
        <Text style={styles.headerSubtitle}>
          It won't take any longer, lets start with a photo.
          {'\n\n'}
          Remember to follow the rules, No 🍆, neither 🍑 😒
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', marginTop: 25}}>
        <Button
          disabled={!imageUri}
          title="Next step"
          onPress={() => onConfirm(imageUri)}
          color={COLORS.primary_color}
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#F8F9FD',
    paddingHorizontal: 40,
    paddingTop: 15,
  },
  header: {
    width: '100%',
    marginTop: 25
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary_color,
    fontFamily: 'RedHatDisplayRegular',
  },
  headerSubtitle: {
    textAlign: 'center',
    color: COLORS.primary_color_darker,
    fontFamily: 'RedHatDisplayRegular',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  imageContainerText: {
    textAlign: 'center',
    color: COLORS.primary_color
  },
  imageContainer: {
    padding: 10,
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 50,
    borderWidth: 5,
    borderColor: COLORS.primary_color,
    borderStyle: "dashed"
  },
});

export default Step1;