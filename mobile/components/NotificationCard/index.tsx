// @Packages
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// @Project
import { IPet } from 'interfaces';
import { COLORS } from 'styles';

interface ActivityProps {
  type: string,
  title: string,
  subtitle: string,
  pet?: IPet
};

const Activity: React.FC<ActivityProps> = ({
  type,
  title,
  subtitle,
  pet
}) => {

  const getIcon = () => {
    switch(type) {
      case 'SCANNED':
        return 'qrcode';
      default:
        return '';
    }
  }

  const getOnPress = () => {
    switch(type) {
      case 'SCANNED':
        return
      default:
        return () => {};
    }
  };

  return (
    <TouchableOpacity style={styles.activityCard} onPress={getOnPress()}>
      <View style={styles.activityCardIcon}>
        <FontAwesome name={"qrcode"} size={25} color={COLORS.primary_color_darker} />
      </View>
      <View style={styles.activityCardDescription}>
        <Text style={styles.activityCardTitle}>{title}</Text>
        <Text style={styles.activityCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  activityCard: {
    width: '100%',
    minHeight: 75,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  activityCardIcon: {
    height: 50,
    width: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary_color_light_2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityCardDescription: {
    justifyContent: 'center'
  },
  activityCardTitle: {
    fontWeight: '700'
  },
  activityCardSubtitle: {
    marginTop: 2
  },
});

export default Activity;