// @Packages
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// @Project
import { INotificationType, IPet } from '../../interfaces';
import { PRIMARY_COLOR_LIGHT } from '../../styles';
import { RootStackParamList } from '../../views/TabNavigator';

// @ Own
import styles from './styles';


interface ActivityProps {
  type: INotificationType,
  title?: string,
  subtitle?: string,
  pet?: IPet
};

const Activity: React.FC<ActivityProps> = ({
  type,
  title,
  subtitle,
  pet
}) => {
  const [curatedTitle, setCuratedTitle] = useState(title);
  const [curatedSubtitle, setCuratedSubtitle] = useState(subtitle);
  const [curatedIcon, setCuratedIcon] = useState('question');

  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  useEffect(() => {
    switch(type) {
      case "SCANNED":
        setCuratedIcon('qrcode');

        if (!curatedTitle) {
          setCuratedTitle(`Someone scanned ${pet?.name}`);
          setCuratedSubtitle('Your information was shared.')
        }
        break;
      case 'NEW_LOCATION':
        setCuratedIcon('location-arrow');

        if (!curatedTitle) {
          setCuratedTitle(`Someone shared ${pet?.name}'s location`);
          setCuratedSubtitle("Check your pet's profile.")
        }
        break;
      default:
        setCuratedTitle(`Unknown notification. [${type}]`);
        setCuratedSubtitle("This is odd.")
        break;
    }
  }, [])

  const getOnPress = () => {
    switch(type) {
      case 'SCANNED':
        navigation.navigate("PetStack", { screen: 'PetProfile', params: { id: pet!.id }});
        return
      case 'NEW_LOCATION':
        navigation.navigate("PetStack", { screen: 'PetLocations', params: { id: pet!.id }});
        break;
      default:
        return
    }
  };

  return (
    <TouchableOpacity style={styles.activityCard} onPress={getOnPress}>
      <View style={styles.activityCardIcon}>
        <FontAwesome6 name={curatedIcon} size={25} color={PRIMARY_COLOR_LIGHT} />
      </View>
      <View>
        <Text style={styles.activityCardTitle}>{curatedTitle}</Text>
        <Text style={styles.activityCardSubtitle}>{curatedSubtitle}</Text>
      </View>
    </TouchableOpacity>
  )
};

export default Activity;