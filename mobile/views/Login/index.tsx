// @Packages
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';


const Login = () => {

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>
          Welcome to PuppySignal
        </Text>
        <Text style={styles.description}>
          Track your pets with us!
        </Text>
        <Text style={styles.descriptionTos}>* By creating an account you accept our ToS</Text>
        <Text style={styles.tos}>Terms of service</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8779F5',
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 25,
    marginLeft: 15,
    fontFamily: 'RedHatDisplayRegular',
    color: "#fff"
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  body: {
    padding: 45,
    paddingTop: 125,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  description: {
    fontSize: 15,
    marginVertical: 10,
    color: '#fff',
  },
  descriptionTos: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 10,
  },
  tos: {
    marginTop: 'auto',
    alignSelf: 'center',
    color: '#fff',
  }
});

export default Login;