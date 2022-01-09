// @Packages
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

// @Project
import { COLORS } from 'styles';
import { logOut } from 'actions/session';

const More: React.FC<any> = () => {
  const dispatch = useDispatch()

  const onLogoutPress = () => {
    console.log("REEEEEEEEEE")
    dispatch(logOut())
  }

  const onDeleteAccountPress = () => {
    // TODO
  }

  const onUpdateProfilePress = () => {
    // TODO
  }

  const onDownloadDataPress = () => {
    // TODO
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.profileCard}>
          <View style={styles.profileCardAvatarWrapper}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/00/2d/2c/002d2c77c221715e795e00298527b750.jpg"
              }}
              style={styles.profileCardAvatar}
            />
          </View>
          <View style={styles.profileCardBody}>
            <View>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.value}>Lorem</Text>
            </View>
            <View>
              <Text style={styles.title}>Lastname</Text>
              <Text style={styles.value}>Ipsum</Text>
            </View>
            <View>
              <Text style={styles.title}>Birthday</Text>
              <Text style={styles.value}>18/02</Text>
            </View>
          </View>
        </View>
        {/* Contact */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'column' }]}>
            <View>
              <Text style={styles.title}>Email</Text>
              <Text style={[styles.value, { color: '#d1d1d1' }]}>liottafabrizio@gmail.com</Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Phone Number</Text>
              <Text style={[styles.value, { color: '#d1d1d1' }]}>+54 9 341 3214567</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 20, }}>
          <TouchableOpacity onPress={onLogoutPress}>
            <Text style={styles.buttoncta}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.buttoncta} onPress={() => {}}>Update profile</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.buttoncta}>Download my data</Text>
          </TouchableOpacity>
          <TouchableOpacity>
          <Text style={[styles.buttoncta, { color: 'red' }]}>Delete my account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 25,
    paddingTop: 75,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.bg_color
  },
  profileCard: {
    width: '100%',
    paddingVertical: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative'
  },
  profileCardBody: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileCardAvatar: {
    width: 75,
    height: 75,
    borderRadius: 32,
    position: 'absolute',
    top: -40
  },
  profileCardAvatarWrapper: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center'
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  value: {
    fontSize: 16
  },
  buttoncta: {
    paddingVertical: 10
  }
});

export default More;