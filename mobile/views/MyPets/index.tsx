// @Packages
import React, { Fragment, useEffect, useState } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// @Project
import PetCard from 'components/PetCard';
import BannerCTA from 'components/BannerCTA';

// @Own
import styles from './styles';
import { getPetsProfile } from './actions';
import { IThunkDispatcher } from 'interfaces';
import { selectMyPetsPets } from './selectors';

const MyPets: React.FC<any> = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const dispatch: IThunkDispatcher = useDispatch();
  const pets = useSelector(selectMyPetsPets);

  const onQRPress = (petId: number) => {
    navigation.navigate('QRsPage', { id: petId });
  }
  const onCardPress = (petId: number) => {
    navigation.navigate('PetProfile', { id: petId });
  }

  const onRegisterPetPress = () => {
    navigation.navigate('PetCreate');
  }


  useEffect(() => {
    dispatch(getPetsProfile())
  }, [])

  const onRefresh = async () => {
    setIsRefreshing(true)

    dispatch(getPetsProfile())
    
    setIsRefreshing(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <BannerCTA
          pulse={!pets.length}
          onPress={onRegisterPetPress}
          title="Register a pet 🐶!"
          description="Less than a few minutes and voila ✨!"
          image={null}
          imageStyle={{
            right: -25,
            bottom: 25,
            width: '75%'
          }}
        />
        <View style={styles.petlist}>
          {pets.length > 0 
            ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                  />
                }
                data={pets}
                renderItem={(item: any) => {
                  const isNotLastOne = item.index < pets.length - 1;
                  const { item: pet } = item;

                  return (
                    <Fragment>
                      <PetCard
                        pet={pet}
                        onPress={() => onCardPress(pet.id)}
                        onQRPRess={() => onQRPress(pet.id)}
                      />
                      {isNotLastOne ? <View style={styles.divisor}></View> : <View style={{marginBottom: 20}}></View>}
                    </Fragment>
                  )
                }}
              />
            )
            : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>You have no pets added{'\n'} Go ahead and add some :)</Text>
              </View>
            )
          }
        </View>
      </View>
    </View>
  );
}

export default MyPets;