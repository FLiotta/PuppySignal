// @Packages
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @Project
import { setAuthenticated } from '../../app.slice';
import { useAppDispatch } from '../../store';
import Logo from '../../assets/logo-alt.png';
import { isAuthTokenExpired } from '../../utils';
import { useLazyRefreshQuery } from '../../api/auth';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../constants';

// @Own
import styles from './styles';


interface ISplashView {
  onFinish: () => void
}

const SplashView: React.FC<ISplashView> = ({ onFinish }) => {
  const dispatch = useAppDispatch();

  const [triggerRefreshSession] = useLazyRefreshQuery()

  useEffect(() => {
    // In case you are wondering why I created a 'handleRefreshSession' fn inside useEffect
    // https://stackoverflow.com/a/53572588/10876293
    const handleRefreshSession = async () => {
      try {
        // 1. Check if there's a refresh_token stored
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

        if (!refreshToken) {
          throw new Error("No refresh token found when attempting to refresh session.");
        }

        // 2. Validates if still vaild
        if (isAuthTokenExpired(refreshToken)) {
          dispatch(setAuthenticated(false));

          throw new Error("Refresh token found, but its expired.")
        }

        // 3. Request a new access_token in case it is and store it.
        const refreshTokenResponse = await triggerRefreshSession(refreshToken).unwrap();
        await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, refreshTokenResponse.access_token);

        dispatch(setAuthenticated(true))
      } catch (e) {
        console.error(e);
      }

      onFinish();
    }

    handleRefreshSession()
  }, [])
  
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  )
}

export default SplashView;