// @Packages
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';

// @Project
import { COLORS } from 'styles';

const Loading: React.FC<any> = () => {

  return (
    <View style={styles.container}></View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary_color
  }
})

export default Loading;