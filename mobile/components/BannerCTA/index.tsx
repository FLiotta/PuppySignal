// @Packages
import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';

// @Project
import { COLORS } from 'styles'
// @Own
import styles from './styles';


interface IProps {
  extraStyles?: any,
  title: string,
  description: string,
  image: any,
  imageStyle?: any,
  pulse?: boolean
  onPress(): void
}

const CTABanner: React.FC<IProps> = ({ title, description, image, imageStyle, onPress, pulse }) => {
  const animScale: any = new Animated.Value(1);
  const animOp: any = new Animated.Value(1);

  let scaleLoop = Animated.loop(
    Animated.timing(animScale, {
      toValue: 1.06,
      duration: 1000,
      useNativeDriver: true,
    })
  );

  let opLoop = Animated.loop(
    Animated.timing(animOp, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    })
  );

  if(pulse) {
    scaleLoop.start();
    opLoop.start();
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.presentation}>
        <Text style={styles.presentationTitle}>{title}</Text>
        <Text style={styles.presentationDesc}>{description}</Text>
        <Image source={image} style={{
          ...styles.presentationImage,
          ...imageStyle
        }} />
      </View>
      <Animated.View 
        style={[
          styles.presentation,
          {
            zIndex: -10,
            position: 'absolute',
            width: '100%',
            opacity: animOp,
            borderWidth: 2,
            borderColor: COLORS.primary_color_darker,
            transform: [{ scale: animScale }]
          }
        ]}
      >
      </Animated.View>
    </TouchableOpacity>
  );
}

export default CTABanner;