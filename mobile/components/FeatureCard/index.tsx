// @Packages
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// @Project
import { COLORS } from 'styles'

interface FeatureCardProps {
  imageSource: any,
  onPress(): any,
  title: string,
  subtitle: string,
  description?: string,
  style?: any
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSource,
  title,
  subtitle,
  description,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View style={styles.card}>
        <Image
          source={imageSource}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        {description && (
          <Text style={styles.cardDescription}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    width: '100%',
    height: 80,
    overflow: 'hidden',
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: COLORS.primary_color
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 20,
    color: "#ffffff",
    zIndex: 10
  },
  cardSubtitle: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 0,
    zIndex: 10
  },
  cardDescription: {
    marginTop: 15,
    color: '#fff'
  },
  cardImage: {
    width: 100,
    height: 100,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    right: -60,
    top: -15,
    zIndex: 1,
    opacity: 0.3,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 25
  },
});

export default FeatureCard;