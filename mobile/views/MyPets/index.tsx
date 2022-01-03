// @Packages
import React, { Fragment } from 'react';
import { View, FlatList, Text } from 'react-native';

// @Project
import PetCard from 'components/PetCard';
import BannerCTA from 'components/BannerCTA';

// @Own
import pets from './mock_data.json'
import styles from './styles'

const MyPets: React.FC<any> = ({ navigation }) => {
  const onQRPress = () => {
    // TODO
  }
  const onCardPress = () => {
    // TODO
  }

  const onRegisterPetPress = () => {
    // TODO
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <BannerCTA
          pulse={!pets.length}
          onPress={onRegisterPetPress}
          title="Register a pet 🐶!"
          description="Less than a few minutes and voila ✨!"
          image=""
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
                        onPress={onCardPress}
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