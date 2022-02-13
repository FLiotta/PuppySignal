// @Packages
import React, { useEffect, useState } from 'react';
import { View, Image, Text, Button } from 'react-native';

// @Project
import { COLORS } from 'styles';
import { IPet } from 'interfaces';

// @Own
import styles from './styles';

const Strong: React.FC<any> = (props) => (
  <Text style={{ fontWeight: '700' }}>{props.children}</Text>
);

const Found: React.FC<any> = ({ route }) => {
  const [pet, setPet] = useState<IPet>();

  useEffect(() => {
    setPet(route.params);
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackground}></View>
        <Image
          source={{
            uri: pet?.profile_picture
          }}
          style={styles.petPhoto}
        />
      </View>
      <View style={styles.body}>
        <Text>
          It seems you just found a <Strong>dog</Strong> called <Strong>{pet?.name}</Strong>{'\n'}
        </Text>
        <Text>
          His hair color is <Strong>Black</Strong>, <Strong>White</Strong> and he's <Strong>2 Years old</Strong>{'\n'}
        </Text>
        <Text>
          His owner reported him as <Strong>lost</Strong> and let a message with some extra information for when this moment arrives:
          {'\n'}{'\n'}
          <Text style={{ backgroundColor: COLORS.primary_color }}>"{pet?.extra}"</Text>
        </Text>
        <View style={styles.divider}></View>
        <Text>
          By just scanning this QR, The locations were sent right to his owner and we notified him.
          {`\n`}{`\n`}
          But we made a few more options in case you want to be the hero <Strong>{pet?.name}</Strong> needs
        </Text>
        <View style={{ marginTop: 25 }}>
          <Button
            title="Send an email"
            onPress={() => {}}
            color={COLORS.primary_color}
          />
        </View>
      </View>
    </View>
  )
};

export default Found;