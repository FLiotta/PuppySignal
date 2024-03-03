// @ Packages
import { ActivityIndicator, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// @ Project
import Map from "../../components/Map";
import { PetStackParamList } from "../PetStack";
import { useGetPetLocationsQuery } from "../../api/pet";
import { PRIMARY_COLOR } from "../../styles";

// @ Own
import styles from './styles';


type Props = NativeStackScreenProps<PetStackParamList, 'PetLocations'>;

const PetLocationsView: React.FC<Props> = ({ route }) => {
  const { data, isLoading, isSuccess } = useGetPetLocationsQuery(route.params.id);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator color={PRIMARY_COLOR} size='large' />}

      {isSuccess && <Map locations={data} zoomControlEnabled />}
    </View>
  )
}

export default PetLocationsView;