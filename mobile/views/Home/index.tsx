// @Packages
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

// @Project
import BannerCTA from 'components/BannerCTA'
import NotificationCard from 'components/NotificationCard'

dayjs.extend(relativeTime)

// @Own
import activities from './mock_data.json'
import styles from './styles';

const Home: React.FC<any> = () => {

  const handleOpenFAQ = () => {
    const path = 'https://www.puppysignal.com/faq';

    Linking.canOpenURL(path).then(supported => {
      if (supported) {
        Linking.openURL(path);
      }
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Lorem Ipsum
          </Text>
          <Image
            style={styles.headerImage}
            source={{
              uri: "https://i.pinimg.com/736x/00/2d/2c/002d2c77c221715e795e00298527b750.jpg"
            }}
          />
        </View>
        <BannerCTA
          title="Need help?"
          description="We all did at some point, take a look at our FAQ."
          onPress={handleOpenFAQ}
          image=""
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