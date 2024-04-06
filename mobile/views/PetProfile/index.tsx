// @Packages
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import QR from 'react-native-qrcode-svg';
import dayjs from 'dayjs';

// @Project
import { PetStackParamList } from '../PetStack';
import Map from '../../components/Map';
import { useGetPetByIdQuery, useToggleLostMutation } from '../../api/pet';
import { PRIMARY_COLOR } from '../../styles';
import Button from '../../components/Button';

// @ Own
import styles from './styles';


type Props = NativeStackScreenProps<PetStackParamList, 'PetProfile'>;

const PetProfileView: React.FC<Props> = ({ navigation, route }) => {
  const { data, isLoading } = useGetPetByIdQuery({ id: route.params.id });
  const [triggerLost, triggerLostResponse] = useToggleLostMutation();

  const onCodesPress = () => {
    navigation.navigate("PetCodes", { id: route.params.id });
  }

  const onLocationsPress = () => {
    navigation.navigate("PetLocations", { id: route.params.id });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.profileCard}>
          <View style={styles.profileCardAvatarWrapper}>
            <Image
              source={{
                uri: 'https://petsname.s3.us-east-2.amazonaws.com/' + data?.profile_picture
              }}
              style={styles.profileCardAvatar}
            />
          </View>
          <View style={styles.profileCardBody}>
            <View>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.value}>
                {isLoading ? "..." : data?.name}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Specie</Text>
              <Text style={styles.value}>
                {isLoading ? "..." : data?.specie?.name}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Breed</Text>
              <Text style={styles.value}>
                {isLoading ? "..." : data?.breed?.name || 'Not specified'}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody]}>
            <View>
              <Text style={styles.title}>Description</Text>
              <Text style={[styles.value]}>
                {isLoading ? "..." : data?.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Missing */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody]}>
            <View style={{ width: "100%"}}>
              <Text style={styles.title}>Missing</Text>
              <Text style={[styles.value]}>
                {data?.lost_since
                  ? `${data?.name} its been missing from its home since ${dayjs(data?.lost_since).format("DD/MM/YYYY [at] HH:mmA")}`
                  : 'Notify that your pet is missing. When people scan its code, they will know for how long it has been out of the home.'
                }
              </Text>
              <View style={{ marginTop: 30 }}>
                <Button
                  text={data?.lost_since ? `${data?.name} was found!` : `${data?.name} is missing!`} 
                  onPress={() => triggerLost(data!.id)}
                  disabled={isLoading || triggerLostResponse.isLoading}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Code */}
        <View style={[styles.profileCard, { marginTop: 30, paddingVertical: 25 }]}>
          <View style={[styles.profileCardBody, { flexDirection: 'row' }]}>
            <View style={{ width: '60%'}}>
              <Text style={styles.title}>QR Codes</Text>
              <Text style={[styles.value]}>
                Check and manage all the codes your pet has.
              </Text>
              <Text style={[styles.value, { color: PRIMARY_COLOR, marginTop: "auto" }]} onPress={onCodesPress}>
                Manage codes
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <QR value='PuppySignal'/>
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
                style={[styles.value, { color: PRIMARY_COLOR, marginVertical: 25 }]}
                onPress={onLocationsPress}
              >
                For a better preview, expand the map.
              </Text>
            </View>
            <View style={{ justifyContent: 'center', height: 250 }}>
              <TouchableOpacity onPress={onLocationsPress}>
                <Map 
                  zoomControlEnabled={false}
                  zoomEnabled={false}
                  zoomTapEnabled={false}
                  rotateEnabled={false}
                  scrollEnabled={false}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default PetProfileView;