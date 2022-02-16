// @Packages
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import QR from 'react-native-qrcode-svg';

// @Project
import Map from 'components/Map';
import { ILocation, IThunkDispatcher } from 'interfaces'
import { getPetLocations } from 'services/pet';
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
  const dispatch: IThunkDispatcher = useDispatch();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);
  const pet = useSelector(selectPetProfile);

  useEffect(() => {
    const petId = route.params.id;

    dispatch(getPetProfile(petId))


    /*
      What would be a better idea regard to locations?
      They're only used here and in the PetLocations view.

      Should I store them in the pet profile reducer?
    */
    getPetLocations(petId)
      .then((response) => {
        const locations = response.data.data;

        if(locations.length > 0) {
          locations.sort((a: any, b: any) => a.id - b.id)

          setLocations(locations);
        } else {
          setLocations([]);
        }
      })
      .catch(console.log)
      .finally(() => setLocationsLoading(false))
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
          <View style={[styles.profileCardBody]}>
            <View>
              <Text style={styles.title}>Description</Text>
              <Text style={[styles.value]}>{pet?.extra}</Text>
            </View>
          </View>
        </View>
        {/* Code */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'row' }]}>
            <View>
              <Text style={styles.title}>QR Codes</Text>
              <Text style={[styles.value]}>
                Your pet currently has 14{'\n'}active codes assigned.{'\n'}
              </Text>
              <Text style={[styles.value, { color: COLORS.primary_color, paddingVertical: 10 }]} onPress={onCodesPress}>
                Manage codes
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <QR
                value={`This QR Code is only for decoration purposes =). Click in MANAGE CODES to see your pet codes.`}
              />
            </View>
          </View>
        </View>
        {/* Locations */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'column' }]}>
            <View>
              <Text style={styles.title}>Locations</Text>
              <Text style={[styles.value]}>
                Here you can preview the last location from where the code was scanned.
              </Text>
              <Text
                style={[styles.value, { color: COLORS.primary_color, paddingVertical: 10 }]}
                onPress={onLocationsPress}
              >
                {"\n"}
                For a better preview, expand the map.
                {"\n"}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', height: 250 }}>
              {!locationsLoading && (
                <Map 
                  locations={locations}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  zoomControlEnabled={false}
                  zoomTapEnabled={false}
                  rotateEnabled={false}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default PetProfile