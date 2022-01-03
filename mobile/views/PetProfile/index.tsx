// @Packages
import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'

// @Project
import QR from 'assets/qr.png'
import MAP from 'assets/maps.png'
import FeatureCard from 'components/FeatureCard'
import { IPet } from 'interfaces'
import { COLORS } from 'styles'

// @Own
import styles from './styles'

const PetProfile: React.FC<any> = () => {
  const onCodesPress = () => {
    // TODO
  }

  const onLocationsPress = () => {
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
              <Text style={styles.title}>Specie</Text>
              <Text style={styles.value}>Dog</Text>
            </View>
            <View>
              <Text style={styles.title}>Birthday</Text>
              <Text style={styles.value}>18/02</Text>
            </View>
          </View>
        </View>
        {/* Description */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'column' }]}>
            <View>
              <Text style={styles.title}>Description</Text>
              <Text style={[styles.value]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse volutpat auctor laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: 25}}>
          <FeatureCard
            style={{ width: '48%' }}
            onPress={onCodesPress}
            title="Codes"
            subtitle="List your pet's QR Codes"
            imageSource={QR}
          />
          <FeatureCard
            style={{ width: '48%' }}
            onPress={onLocationsPress}
            title="Locations"
            subtitle="Inspect your pet's locations"
            imageSource={MAP}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default PetProfile