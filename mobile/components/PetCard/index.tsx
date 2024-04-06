// @Packages
import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

// @Project
import { IPet } from '../../interfaces';

// @ Own
import styles from './styles';


interface PetCardProps {
  pet: IPet,
  onPress?(): void,
  onQRPRess?(): void,
  extraStyle?: ViewStyle,
};

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onPress,
  extraStyle,
  onQRPRess
}) => {

  const species: {[id: string]: string} = {
    1: '🐶',
    2: '🐱',
    3: '🐷',
    4: '🐴'
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, extraStyle]}>
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image
            style={styles.photo}
            source={{ uri: pet?.profile_picture }}
          />
          <Text style={styles.specieBadge}>{species[pet.specie.id]}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.rightHeader}>
            <Text style={styles.name}>{pet.name} {pet.id}</Text>
            {pet.lost_since && <Text style={styles.missing}> (missing)</Text>}
          </View>
          <Text style={styles.description} numberOfLines={2}>{pet.description}</Text>
          <View style={styles.QRCodeWrap}>
            <FontAwesome6 name="qrcode" style={styles.QRCode} onPress={onQRPRess} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
};

export default PetCard;