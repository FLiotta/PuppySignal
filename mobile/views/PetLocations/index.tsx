// @Packages
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// @Project
import Map from 'components/Map';
import { getPetLocations } from 'services/pet';

// @Own
import styles from './styles';

interface IProps {
  navigation: any,
  route: RouteProp<{
    params: {
      id: number
    }
  }, 'params'>
}

const PetLocations: React.FC<IProps> = ({ navigation, route }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<any>([]);

  useEffect(() => {
    const id = route.params.id;

    getPetLocations(id)
      .then((response) => {
        const locations = response.data.data;

        if(locations.length > 0) {
          locations.sort((a: any, b: any) => a.id - b.id)

          setLocations(locations);
        } else {
          setLocations([]);
        }
      })
      .catch(() => {
        Toast.show({
          text1: "Ohm no!",
          text2: "Something failed while fetching the locations, would you please try again later?",
          type: "error",
          position: "bottom"
        })
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {!loading && (
        <Map
          locations={locations}
          showLocationsSidebar
          zoomEnabled
          zoomTapEnabled
          zoomControlEnabled
          rotateEnabled
          scrollEnabled
        />
      )}
    </View>
  );
}

export default PetLocations;