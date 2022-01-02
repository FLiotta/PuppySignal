// @Packages
import React from 'react';
import { View, Text } from 'react-native';

interface IProps {
  text: string
}

const Button: React.FC<IProps> = ({
  text
}) => {

  return (
    <View>
      <Text>{text}</Text>
    </View>
  )
}

export default Button;