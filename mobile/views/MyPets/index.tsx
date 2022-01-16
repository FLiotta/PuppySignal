// @Packages
import React, { Fragment, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
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
  const dispatch: IThunkDispatcher = useDispatch();
  const pets = useSelector(selectMyPetsPets);

  const onQRPress = () => {
    // TODO
  }
  const onCardPress = (petId: number) => {
    navigation.navigate('PetProfile', { id: petId });
  }

  const onRegisterPetPress = () => {
    // TODO
  }

  useEffect(() => {
    dispatch(getPetsProfile())
  }, [])

  useEffect(() => {
    console.log(pets)
  }, [pets])

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
                data={pets}
                renderItem={(item: any) => {
                  const isNotLastOne = item.index < pets.length - 1;
                  const { item: pet } = item;

                  return (
                    <Fragment>
                      <PetCard
                        pet={pet}
                        onPress={() => onCardPress(pet.id)}
                        onQRPRess={onQRPress}
                      />
                      {isNotLastOne && <View style={styles.divisor}></View>}
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