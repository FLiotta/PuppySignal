// @ Packages
import { useEffect, createRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import dayjs from 'dayjs';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

// @ Project
import { ILocation } from '../../interfaces';
import { PRIMARY_COLOR } from "../../styles";

// @ Own
import styles from './styles'


interface IProps {
  locations?: ILocation[],
  scrollEnabled?: boolean,
  zoomEnabled?: boolean,
  zoomTapEnabled?: boolean,
  zoomControlEnabled?: boolean,
  rotateEnabled?: boolean,
}

const Map: React.FC<IProps> = ({
  locations,
  scrollEnabled, 
  zoomEnabled,
  zoomTapEnabled,
  zoomControlEnabled,
  rotateEnabled
}) => {
  const [defaultCoords, setDefaultCoords] = useState<ILocation>();
  const [selectedLocation, setSelectedLocation] = useState<ILocation>();
  const mapRef = createRef<any>();

  useEffect(() => {
    if(locations && locations.length) {
      setDefaultCoords(locations[locations.length - 1])
      return
    }

    const handleDefaultCoords = async () => {
      const tempCoords = {
        id: 0,
        latitude: 0,
        longitude: 0,
        created_at: new Date(),
        updated_at: new Date()
      }

      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if(granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            tempCoords['latitude'] = position.coords.latitude
            tempCoords['longitude'] = position.coords.longitude
    
            setDefaultCoords(tempCoords);
          },
          () => setDefaultCoords(tempCoords)
        )

        return
      }

      setDefaultCoords(tempCoords);
    }
    
    handleDefaultCoords()
  }, [])

  if (!defaultCoords) {
    return (
      <View
        style={{ 
          width: "100%", 
          height: "100%", 
          justifyContent: "center", 
          alignItems: "center"
        }}
      >
        <ActivityIndicator color={PRIMARY_COLOR} size='small' />
      </View>
    )
  }

  const onLocationPress = (location: ILocation) => {
    setSelectedLocation(location);

    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    })
  }

  return (
    <View style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: defaultCoords.latitude,
          longitude: defaultCoords.longitude,
          longitudeDelta: 0.02,
          latitudeDelta: 0.02,
        }}
        scrollEnabled={scrollEnabled}
        zoomEnabled={zoomEnabled}
        zoomTapEnabled={zoomTapEnabled}
        zoomControlEnabled={zoomControlEnabled}
        rotateEnabled={rotateEnabled}
        ref={mapRef}
      >
        {locations && locations.map((location, index: number) => (
          <Marker
            key={`market_${location.id}`} 
            title={String(index + 1)}
            onPress={() => onLocationPress(location)}
            coordinate={location}
          />
        ))}

        <Polyline 
          coordinates={locations ? locations.map((location: any) => ({
            latitude: location.latitude,
            longitude: location.longitude
          })) : []}
          strokeColor={PRIMARY_COLOR}
          strokeWidth={4}
        />
      </MapView>

      {locations && (
        <FlatList
          style={styles.locationsList}
          data={[...locations].sort((a: any, b: any) => b.id - a.id)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onLocationPress(item)}>
              <View style={styles.location}>
                <FontAwesome6 name="location-dot" color={PRIMARY_COLOR} size={15} />
              </View>
              <View style={styles.locationIdContainer}>
                <Text style={styles.locationId}>{item.id}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedLocation && (
          <View style={styles.selectedLocationContainer}>
            <View style={styles.selectedLocation}>
              <View style={styles.selectedLocationData}>
                <Text>
                  Lat/Lng: {selectedLocation?.latitude} / {selectedLocation?.longitude}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  Scanned on {
                    dayjs(selectedLocation.created_at).format('DD/MM/YYYY [at] HH:mm A')
                  } 
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedLocation(undefined)}
                style={styles.selectedLocationClose}
              >
                <FontAwesome6 name="xmark" color="#000000" size={15} />
              </TouchableOpacity>
            </View>
          </View>
        )}
    </View>
  )
}

export default Map;