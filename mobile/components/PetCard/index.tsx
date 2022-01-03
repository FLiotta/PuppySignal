// @Packages
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// @Project
import { COLORS } from 'styles';
import { IPet } from 'interfaces';

interface PetCardProps {
  pet: IPet,
  onPress?(): void,
  onQRPRess?(): void,
  customStyle?: any,
};

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onPress,
  customStyle,
  onQRPRess
}) => {

  const species: any = {
    1: '🐶',
    2: '🐱',
    3: '🐷',
    4: '🐴'
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{...styles.container, ...customStyle}}>
        <View style={styles.photoContainer}>
          <Image
            style={styles.photo}
            source={{
              uri: pet.profile_picture
            }}
          />
          <Text style={styles.specieBadge}>{species[pet.specie.id]}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.rightHeader}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.date}>🍰 6 Years old</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>{pet.extra}</Text>
          <View style={styles.QRCodeWrap}>
            <FontAwesome name="qrcode" style={styles.QRCode} onPress={onQRPRess} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    fontSize: 12,
    color: '#444',
    marginLeft: 4,
  },
  specieBadge: {
    textAlign: 'center',
    textAlignVertical: 'center',
    position: 'absolute',
    top: -8,
    right: -5,
    padding: 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    fontSize: 15,
  },
  photoContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    alignItems: 'center'
  },
  photo: {
    borderRadius: 20,
    width: 50,
    height: 50,
  },
  container: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  name: {
    fontSize: 15,
    fontWeight: "700"
  },
  description: {
    color: "#3a3a3a",
    maxWidth: '75%',
    flexWrap: 'wrap',
  },
  right: {
    flex: 1,
    paddingLeft: 20,
    position: 'relative',
    justifyContent: 'flex-start'
  },
  QRCodeWrap: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
  },
  QRCode: {
    position: 'absolute',
    fontSize: 25,
    padding: 7,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary_color_light_2,
    color: COLORS.primary_color_darker,
    borderRadius: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});

export default PetCard;