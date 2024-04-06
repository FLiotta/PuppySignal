// @Packages
import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// @Project
import BannerCTA from '../../components/BannerCTA';
import { useGetPetsQuery } from '../../api/profile';
import { PRIMARY_COLOR } from '../../styles';
import PetCard from '../../components/PetCard';
import { PetStackParamList } from '../PetStack';

// @Own
import styles from './styles';


type IProps = NativeStackScreenProps<PetStackParamList, 'MyPets'>;

const PetsView: React.FC<IProps> = ({ navigation }) => {
  const { data, isLoading, isFetching, refetch } = useGetPetsQuery({ offset: 0, limit: 50});
  
  const handlePetCardPress = (id: number) => {
    navigation.navigate("PetProfile", { id })
  }

  const handlePetCardQRPress = (id: number) => {
    navigation.navigate("PetCodes", { id });
  }

  const handlePetCreateBannerPress = () => {
    navigation.navigate("PetCreation");
  }

  return (
    <FlatList
      data={data?.data}
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 50
      }}
      refreshControl={
        <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetch} colors={[PRIMARY_COLOR]}/>
      }
      keyExtractor={item => item.uuid}
      ListHeaderComponent={() => (
        <View>
          <Text style={styles.title}>Pets</Text>
          <BannerCTA
            title='Add a new pet!'
            description="Create a profile for your them and a code will be generated, It won't take more than a few minutes."
            onPress={handlePetCreateBannerPress}
            extraStyles={{ marginVertical: 25 }}
          />

          <Text style={styles.subtitle}>My pets</Text>
        </View>
      )}
      renderItem={(pet) => (
        <PetCard
          pet={pet.item} 
          key={pet.item.uuid} 
          extraStyle={{ marginBottom: 15 }}
          onQRPRess={() => handlePetCardQRPress(pet.item.id)}
          onPress={() => handlePetCardPress(pet.item.id)}
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.petsListView}>
          {(isLoading || isFetching) && (
            <ActivityIndicator color={PRIMARY_COLOR} size='large' />
          )}

          {(!data?.data.length && !isLoading && !isFetching) && (
            <Text style={styles.petsListViewEmptyText}>
              You have not created a profile for your pets yet, go ahead and create them!
            </Text>
          )}
        </View>
      )}
      ListFooterComponent={() => (
        <View>
          {(!isLoading && isFetching) && (
            <ActivityIndicator color={PRIMARY_COLOR} size='small' />
          )}
        </View>
      )}
    />
  )
}

export default PetsView;