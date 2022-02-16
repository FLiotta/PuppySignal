// @Packages
import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

// @Project
import { ILocation } from 'interfaces';
import MarkerImage from 'assets/marker.png'

// @Own
import styles from './styles';
import StreetViewGenerator from './StreetViewGenerator';
import { COLORS } from 'styles';


// TODO: It should focus on the last locations when you enter the screen.
// TODO: Maybe some pagination?

interface ILastLocationProps {
  location: ILocation,
  onClose(): any
  visible: boolean
};

const LastLocationDialog: React.FC<ILastLocationProps> = ({location, onClose, visible}) => {
  if(!visible) {
    return <View></View>
  }
  
  return (
    <View style={styles.selectedLocation}>
      <TouchableOpacity 
        onPress={onClose} 
        style={{
          position: 'absolute',
          padding: 10,
          top: 25,
          right: 25,
          borderRadius: 50,
          backgroundColor: '#eee',
          zIndex: 2
        }}
      >
        <FontAwesome name="close" color="#000000" size={10} />
      </TouchableOpacity>
      <View style={{
        width: '100%',
        flexGrow: 1,
      }}>
        <WebView
          style={{
            width: '100%',
            height: '100%',
          }} 
          source={{
            html: StreetViewGenerator(location.latitude, location.longitude),
          }}
        />
        <Text style={{ marginTop: 10 }}>
          Scanned at {location.created_at} ⏰
        </Text>
      </View>
    </View>
  )
}

interface IProps {
  locations: ILocation[],
  showLocationsSidebar?: boolean,
  scrollEnabled?: boolean,
  zoomEnabled?: boolean,
  zoomTapEnabled?: boolean
  zoomControlEnabled?: boolean
  rotateEnabled?: boolean
}


const PetLocations: React.FC<IProps> = ({
  locations,
  showLocationsSidebar,
  scrollEnabled,
  zoomEnabled,
  zoomControlEnabled,
  zoomTapEnabled,
  rotateEnabled
}) => {
  const mapRef = React.createRef<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [userLocation, setUserLocation] = useState<any>();
  const [visibleLocationDialog, setVisibleLocationDialog] = useState<boolean>(false);
  
  const defaultCoords = React.useMemo(
    () => {
      const defaultCoords = {
        latitude: 0,
        longitude: 0
      }

      if(locations.length > 0) {
        return locations[locations.length - 1];
      } else if (userLocation) {
        return userLocation;
      } else {
        return defaultCoords
      }
    },
    [userLocation]
  )

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        //get the Longitude from the location json     
        const curLongitude = position.coords.longitude;
        //get the Latitude from the location json 
        const curLatitude =  position.coords.latitude;  

        setUserLocation({
          latitude: curLatitude,
          longitude: curLongitude,
        });
      },
      undefined,
      {
        showLocationDialog: true
      }
    );
  }, []);

  const onLocationPress = (location: ILocation) => {
    setVisibleLocationDialog(true);
    setSelectedLocation(location);
    
    console.log(mapRef.current.animateToRegion)

    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    })
  }

  return (
    <View>
      <MapView
        style={styles.mapView}
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
        showsUserLocation
        ref={mapRef}
      >
        {locations?.map((location: any, index: number) => (
          <Marker
            key={`market_${location.id}`} 
            title={String(index + 1)}
            onPress={() => onLocationPress(location)}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          />
        ))}

        <Polyline 
          coordinates={locations?.map((location: any) => ({
            latitude: location.latitude,
            longitude: location.longitude
          }))}
          strokeColor={COLORS.primary_color}
          strokeWidth={4}
        />
      </MapView>
      {visibleLocationDialog && (
        <LastLocationDialog
          visible={visibleLocationDialog}
          location={selectedLocation} 
          onClose={() => setVisibleLocationDialog(false)} 
        />
      )}

      {showLocationsSidebar && (
        <FlatList
          style={styles.locationsList}
          data={locations.sort((a: any, b: any) => b.id - a.id)}
          renderItem={({ item, index}) => (
            <TouchableOpacity
              onPress={() => onLocationPress(item)}
              key={`market_${item.id}_location`} 
            >
              <View
                style={styles.location}
                key={`${item.id} - ${item.latitude} - ${item.longitude}`}
              >
                <Image
                  source={MarkerImage}
                  style={styles.locationImage}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default PetLocations;