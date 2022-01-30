// @Packages
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, Linking, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

// @Project
import BannerCTA from 'components/BannerCTA'
import NotificationCard from 'components/NotificationCard'
import { selectSessionProfile } from 'selectors/session';
import { IThunkDispatcher } from 'interfaces';
import { getUserProfile } from 'actions/session';

// @Own
import activities from './mock_data.json'
import styles from './styles';

dayjs.extend(relativeTime)

const Home: React.FC<any> = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const profile = useSelector(selectSessionProfile)
  const dispatch: IThunkDispatcher = useDispatch()

  useEffect(() => {
    if(!profile.id) {
      dispatch(getUserProfile())
    }
  }, [])

  const handleOpenFAQ = () => {
    const path = 'https://www.puppysignal.com/faq';

    Linking.canOpenURL(path).then(supported => {
      if (supported) {
        Linking.openURL(path);
      }
    });
  }

  const onRefresh = async () => {
    setIsRefreshing(true)

    await dispatch(getUserProfile())
    
    setIsRefreshing(false)
  }

  // TODO: MIGRATE THE NOTIFICATIONS SERVICE ONCE FOR ALL
  // STOP PROCASTINATING IT

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Image
            style={styles.headerImage}
            source={{
              uri: profile.profile_picture
            }}
          />
        </View>
        <BannerCTA
          title="Have any question? 🕵🏻‍♀️"
          description="We all did at some point, take a look at our FAQ."
          onPress={handleOpenFAQ}
          image={null}
        />
        <View style={styles.activity}>
          <Text style={styles.activityTitle}>Recent activity</Text>
          {activities && activities.length > 0
            ? activities.map((act: any) => {
              let actDate: string = dayjs(act.created_at).fromNow();

              actDate = actDate.charAt(0).toUpperCase() + actDate.slice(1);

              return (
                <NotificationCard 
                  key={`${act.id}_${act.scanned_pet_id}_scanned`}
                  type={act.type} 
                  title={`Someone scanned your pet ${act.pet?.name}`}
                  subtitle={actDate}
                />
              )
            })
            : <Text>There are no activities yet, come back later!</Text>
          }
        </View>
      </View>
    </ScrollView>
  );
}

export default Home;