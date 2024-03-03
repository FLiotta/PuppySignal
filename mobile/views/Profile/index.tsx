// @Packages
import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// @Project
import Button from '../../components/Button';
import { useGetProfileQuery } from '../../api/profile';
import { useAppDispatch } from '../../store';
import { setAuthenticated } from '../../app.slice';
import { ProfileStackParamList } from '../ProfileStack';

// @Own
import styles from './styles';
import { useLazyUnsuscribeFromTopicsQuery } from '../../api/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_STORAGE_KEY, FCM_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../constants';
import { useLazyDeleteRefreshQuery } from '../../api/auth';


type IProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const ProfileView: React.FC<IProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { data: profile } = useGetProfileQuery();

  const [triggerUnsuscribeNotifications] = useLazyUnsuscribeFromTopicsQuery()
  const [triggerDeleteRefreshToken] = useLazyDeleteRefreshQuery()

  const [logoutInProcess, setLogoutInProcess] = useState(false);
  
  const onLogoutPress = async () => {
    setLogoutInProcess(true);

    try {
      // 1. Unsuscribe from notifications in case there is any FCMToken
      const FCMToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);

      if(FCMToken) {
        await triggerUnsuscribeNotifications(FCMToken);
      }

      // 2. Delete refresh token in case there is any
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

      if (refreshToken) {
        await triggerDeleteRefreshToken(refreshToken);
      }

      // 3. Clean AsyncStorage
      await AsyncStorage.multiRemove([
        FCM_TOKEN_STORAGE_KEY, 
        REFRESH_TOKEN_STORAGE_KEY, 
        ACCESS_TOKEN_STORAGE_KEY
      ]);

      
      dispatch(setAuthenticated(false))
    } catch (e) {
      console.error(e)
    }

    setLogoutInProcess(false);
  }

  const onEditProfilePress = () => {
    navigation.navigate('ProfileEdit');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.cardAvatarWrapper}>
          <Image
            source={{
              uri: profile?.profile_picture
            }}
            style={styles.cardAvatar}
          />
        </View>
        <View style={styles.cardBody}>
          <View>
            <Text style={styles.cardTitle}>Name</Text>
            <Text style={styles.cardValue}>{profile?.first_name}</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Lastname</Text>
            <Text style={styles.cardValue}>{profile?.last_name}</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={[styles.card, { marginTop: 30, paddingVertical: 25 }]}>
        <View style={[styles.cardBody, { flexDirection: 'column' }]}>
          <View>
            <Text style={styles.cardTitle}>Email</Text>
            <Text style={[styles.cardValue, { color: '#d1d1d1' }]}>{profile?.email}</Text>
          </View>
          <View style={{ marginTop: 25 }}>
            <Text style={styles.cardTitle}>Phone Number</Text>
            <Text style={[styles.cardValue, { color: '#d1d1d1' }]}>{profile?.phone_number || "Not provided."}</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 50, marginTop: 20 }}>
        <Button
          text='Edit Profile'
          onPress={onEditProfilePress}
        />
      </View>

      <View style={{ height: 50, marginTop: 10 }}>
        <Button
          text='Close session'
          onPress={onLogoutPress}
          disabled={logoutInProcess}
          light
        />
      </View>
    </View>
  )
}

export default ProfileView;