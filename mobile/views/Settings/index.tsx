// @Packages
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// @Project
import { COLORS } from 'styles';
import { logOut, updateUserProfile } from 'actions/session';
import { selectSessionProfile } from 'selectors/session';
import UpdateProfileModal, { FormPayload } from 'components/ProfileUpdateModal'
import { IThunkDispatcher } from 'interfaces';

const More: React.FC<any> = () => {
  const dispatch: IThunkDispatcher = useDispatch()
  const profile = useSelector(selectSessionProfile)

  const [updateProfileModal, setUpdateProfileModal] = useState<boolean>(true);

  const onLogoutPress = () => {
    dispatch(logOut())
  }

  const onDeleteAccountPress = () => {
    // TODO
  }

  const onDownloadDataPress = () => {
    // TODO
  }

  const onProfileUpdates = (formPayload: FormPayload): Promise<void> => {
    return dispatch(updateUserProfile(formPayload))
      .then(() => {
        console.log("Done")
      })
      .catch((e) => {
        console.log("Ohm no")
      })
  }

  return (
    <ScrollView style={styles.container}>
      <UpdateProfileModal
        onSubmit={onProfileUpdates}
        onClose={() => setUpdateProfileModal(false)}
        isVisible={updateProfileModal}
        title="Update my profile!"
        profile={profile}
      />
      <View style={styles.wrapper}>
        <View style={styles.profileCard}>
          <View style={styles.profileCardAvatarWrapper}>
            <Image
              source={{
                uri: profile.profile_picture
              }}
              style={styles.profileCardAvatar}
            />
          </View>
          <View style={styles.profileCardBody}>
            <View>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.value}>{profile.first_name}</Text>
            </View>
            <View>
              <Text style={styles.title}>Lastname</Text>
              <Text style={styles.value}>{profile.last_name}</Text>
            </View>
          </View>
        </View>
        {/* Contact */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'column' }]}>
            <View>
              <Text style={styles.title}>Email</Text>
              <Text style={[styles.value, { color: '#d1d1d1' }]}>{profile.email}</Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Phone Number</Text>
              <Text style={[styles.value, { color: '#d1d1d1' }]}>{profile.phone_number || "Not provided."}</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 20, }}>
          <TouchableOpacity onPress={onLogoutPress}>
            <Text style={styles.buttoncta}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.buttoncta} onPress={() => setUpdateProfileModal(true)}>Update profile</Text>
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
    justifyContent: 'space-around',
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