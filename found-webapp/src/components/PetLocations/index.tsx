// @Packages
import { useState, useEffect, useCallback, memo } from 'react';
import { InfoWindow, GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

// @Project
import PetService from 'services/PetService';
import { BackendResponse } from 'interfaces/app';

// @Own
import './styles.scss';

interface IProps {
  id: number
};

interface Location {
  id: number,
  latitude: number,
  longitude: number,
  method: string,
  created_at: Date,
  updated_at: Date
};

interface MapProps {
  locations: Location[],
  loading: boolean
};

const Map: React.FC<MapProps> = memo(({ locations, loading }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "api_key"
  });
  const [map, setMap] = useState(null)
  const [lastLocation, setLastLocation] = useState({
    latitude: 0,
    longitude: 0
  });

  
  useEffect(() => {
    if(!loading) {
      if(locations.length > 0) {
        const last = locations[locations.length - 1];

        setLastLocation({
          latitude: last.latitude,
          longitude: last.longitude
        });
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { coords } = position;

            setLastLocation({
              latitude: coords.latitude,
              longitude: coords.longitude
            });
          }
        );
      } 
    }
  }, [loading])

  const onLoad = useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: lastLocation.latitude, lng: lastLocation.longitude }}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {locations?.map((location, index) => (
        <Marker
          key={`market_${location.id}`} 
          position={{ lat: location.latitude, lng: location.longitude }}
          label={String(index + 1)}
        >
        </Marker>
      ))}
      <Polyline 
        path={locations?.map((location) => ({
          lat: location.latitude,
          lng: location.longitude
        }))}
        options={{ 
        strokeColor: '#00ffff',
        strokeOpacity: 1,
        strokeWeight: 2,
        icons: [{ 
          icon: "hello",
          offset: '0',
          repeat: '10px'
        }],
      }}
      />
    </GoogleMap>
  ) : <></>
});

const PetLocationMap: React.FC<IProps> = ({
  id
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
     PetService.getPetLocations(id)
      .then((response: BackendResponse) => {
        let locations = response.data;

        locations.sort((a: Location, b: Location) => a.id - b.id);

        setLocations(locations);
      })
      .catch(console.log)
      .then(() => setLoading(false));
    
    return () => setLocations([]);
  }, []);

  return (
    <div className="petlocations">
      <h4>Locations</h4>
      <p>Here will be displayed your friend locations. Such as where people scanned his collar, his home, etc.</p>
      <Map
        locations={locations}
        loading={loading}
      />
    </div>
  )
}

export default PetLocationMap;