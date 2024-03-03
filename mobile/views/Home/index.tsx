// @Packages
import {
  Image, 
  Linking, 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl
} from 'react-native';

// @Project
import BannerCTA from '../../components/BannerCTA';
import NotificationCard from '../../components/NotificationCard';
import EmptyStatus from '../../assets/corazon.png';
import { PRIMARY_COLOR } from '../../styles';
import { useGetNotificationsQuery } from '../../api/profile';

// @Own
import styles from './styles';


const FAQ_URL = 'https://www.puppysignal.com/faq';

const HomeView: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery()

  const handleOpenFAQ = () => {
    Linking.openURL(FAQ_URL)
      .catch(err => console.error("Couldn't load page", err));
  }

  return (
    <ScrollView
      style={styles.container} 
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetch} colors={[PRIMARY_COLOR]}/>
      }
    >
      <Text style={styles.title}>Home</Text>
      <BannerCTA
        title='Have any question?'
        description='We all did at some point, take a look at our FAQ.'
        onPress={handleOpenFAQ}
        extraStyles={{ marginVertical: 25 }}
      />

      <Text style={styles.subtitle}>Notifications</Text>
      <View style={styles.notificationsView}>
        {isLoading && (
          <ActivityIndicator color={PRIMARY_COLOR} size='large' />
        )}

        {(!data?.length && !isLoading) && (
          <>
            <Image source={EmptyStatus} style={styles.notificationEmptyStatus}/>
            <Text style={styles.notificationsEmptyText}>No notifications yet, come back later!</Text>
          </>
        )}
        {!isLoading && data?.map((notification) => (
          <NotificationCard
            key={`notification_${notification.id}`}
            type={notification.type}
            pet={notification.pet}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default HomeView;