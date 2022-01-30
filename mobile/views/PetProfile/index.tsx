// @Packages
import React, { useEffect } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

// @Project
import QR from 'assets/qr.png'
import MAP from 'assets/maps.png'
import FeatureCard from 'components/FeatureCard'
import { IPet, IThunkDispatcher } from 'interfaces'
import { COLORS } from 'styles'

// @Own
import { getPetProfile } from './actions'
import { selectPetProfile } from './selectors'
import styles from './styles'
import { RouteProp } from '@react-navigation/native'

interface IProps {
  navigation: any,
  route: RouteProp<{
    params: {
      id: number
    }
  }, 'params'>
}

const PetProfile: React.FC<IProps> = ({ 
  navigation,
  route
}) => {
  const dispatch: IThunkDispatcher = useDispatch()
  const pet = useSelector(selectPetProfile)

  useEffect(() => {
    dispatch(getPetProfile(route.params.id))
  }, [])

  const onCodesPress = () => {
    navigation.navigate("QRsPage", { id: route.params.id })
  }

  const onLocationsPress = () => {
    navigation.navigate("PetLocations", { id: route.params.id })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.profileCard}>
          <View style={styles.profileCardAvatarWrapper}>
            <Image
              source={{
                uri: pet?.profile_picture
              }}
              style={styles.profileCardAvatar}
            />
          </View>
          <View style={styles.profileCardBody}>
            <View>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.value}>{pet?.name}</Text>
            </View>
            <View>
              <Text style={styles.title}>Specie</Text>
              <Text style={styles.value}>{pet?.specie?.name}</Text>
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
              <Text style={[styles.value]}>{pet?.extra}</Text>
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