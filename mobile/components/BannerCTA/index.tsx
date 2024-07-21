// @Packages
import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleProp, ViewStyle} from 'react-native';

// @Project
import { PRIMARY_COLOR } from '../../styles'

// @Own
import styles from './styles';


interface IProps {
  extraStyles?: StyleProp<ViewStyle>,
  title: string,
  description: string,
  image?: any,
  imageStyle?: any,
  pulse?: boolean
  onPress(): void
}

const CTABanner: React.FC<IProps> = ({
  title,
  description,
  image,
  imageStyle,
  onPress,
  pulse,
  extraStyles
}) => {
  const animScaleX: any = new Animated.Value(1);
  const animScaleY: any = new Animated.Value(1);
  const animOp: any = new Animated.Value(1);

  let scaleLoopX = Animated.loop(
    Animated.timing(animScaleX, {
      toValue: 1.06,
      duration: 1000,
      useNativeDriver: true,
    })
  );

  let scaleLoopY = Animated.loop(
    Animated.timing(animScaleY, {
      toValue: 1.15,
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
    scaleLoopX.start();
    scaleLoopY.start();
    opLoop.start();
  }

  return (
    <TouchableOpacity onPress={onPress} style={extraStyles}>
      <View style={styles.presentation}>
        <Text style={styles.presentationTitle}>{title}</Text>
        <Text style={styles.presentationDesc}>{description}</Text>
        {image && (
          <Image
            source={image}
            style={{
              ...styles.presentationImage,
              ...imageStyle
            }}
          />
        )}
      </View>
      <Animated.View
        style={[
          styles.presentation,
          {
            zIndex: -10,
            position: 'absolute',
            width: '100%',
            opacity: animOp,
            borderWidth: 0,
            borderColor: PRIMARY_COLOR,
            transform: [{ scaleX: animScaleX }, { scaleY: animScaleY }]
          }
        ]}
      >
      </Animated.View>
    </TouchableOpacity>
  );
}

export default CTABanner;
