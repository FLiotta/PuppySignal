// @Packages
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

// @Project
import { createPet } from 'services/pet';
import { selectAppSpecies } from 'selectors/app';
import { addNewPet } from 'views/MyPets/actions';
import { ISpecie } from 'interfaces';
import Step1 from './Step1';
import Step2 from './Step2';


const CreateNewPet: React.FC<any> = ({ navigation }) => {
  const [imageUri, setImageUri] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const species = useSelector(selectAppSpecies)

  const dispatch = useDispatch();

  const handleStep1Confirm = (imageUri: any) => {
    setImageUri(imageUri);
    setStep(step + 1);
  }

  const handleStep2Confirm = ({ name, description, specie_id}: any) => {
    if(name && description && specie_id) {
      const newPetSpecie: ISpecie | undefined = species.find(s => s.id === specie_id);
  
      if(!newPetSpecie) {
        return; // TODO: Loggear estos errores?
      }

      setLoading(true);

      createPet({
        name, 
        description, 
        specie_id, 
        file: imageUri
      })
        .then((resp) => {
          const newPet = resp.data.data;

          newPet['specie'] = newPetSpecie;

          dispatch(addNewPet(newPet));
          navigation.replace('PetProfile', { id: newPet.id });

          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: `Welcome aboard ${newPet.name}! 🥰`,
            text2: 'Here you will find any data you need, such as locations, code, etc.',
            visibilityTime: 4000,
            autoHide: true,
          });
        })
        .catch((e: any) => {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Something went wrong.',
            text2: 'We are so sorry, would you like to try in a while?',
            visibilityTime: 4000,
            autoHide: true,
          });
        })
        .then(() => setLoading(false));
    } else {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Wait a minute 🤔',
        text2: 'I may be wrong, but i think you still have some empty fields.',
        visibilityTime: 5000,
        autoHide: true,
      });
    }
  }

  const onBack = () => {
    setStep(step - 1);
  }

  return (
    <View style={styles.container}>
      {step == 0 && <Step1 onConfirm={handleStep1Confirm} />}
      {step == 1 && <Step2 onConfirm={handleStep2Confirm} onBack={onBack} loading={loading} />}
    </View> 
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
  },
});

export default CreateNewPet;