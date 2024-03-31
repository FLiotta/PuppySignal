// @ Packages
import * as yup from 'yup';
import { useState } from 'react';
import {
  View, 
  Image, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

// @ Project
import Button from '../../components/Button';
import { PetStackParamList } from '../PetStack';
import { IBreed, ISpecie } from '../../interfaces';
import { useGetSpeciesQuery, useLazyGetBreedsQuery } from '../../api/data';
import { useCreatePetMutation } from '../../api/pet';

// @ Own
import styles from './styles';


type IProps = NativeStackScreenProps<PetStackParamList, 'PetCreation'>;


interface FormValues {
  name: string,
  description: string,
  breed_id: number,
  specie_id: number
}

const PetCreationView: React.FC<IProps> = ({ navigation }) => {
  const species = useGetSpeciesQuery();

  const [triggerGetBreeds, breeds] = useLazyGetBreedsQuery();
  const [triggerCreatePet, petMutation] = useCreatePetMutation()

  const [photo, setPhoto] = useState<ImageOrVideo | undefined>();
  const [selectedSpecie, setSelectedSpecie] = useState<ISpecie | undefined>()
  const [selectedBreed, setSelectedBreed] = useState<IBreed | undefined>()

  const initialValues: FormValues = {
    name: '',
    description: '',
    specie_id: -1,
    breed_id: -1
  }

  const validationSchema = yup.object().shape({
    description: yup.string().required(),
    name: yup.string().required(),
    specie_id: yup.number().min(0).required(),
    breed_id: yup.number()
  });


  const handleFormSubmit = (formData: FormValues) => {
    if(!photo) return

    const { name, description, breed_id, specie_id } = formData;
    
    const createPetParams = {
      name,
      description,
      breed_id,
      specie_id,
      file: {
        uri: photo.path,
        mime: photo.mime
      }
    }
  
    triggerCreatePet(createPetParams)
      .unwrap()
      .then((payload) => {
        navigation.replace("PetProfile", { id: payload.id });
      })
      .catch((e) => {
        console.error(e);
        
        Toast.show({
          position: "bottom",
          type: "error",
          text1: "Something went wrong",
          text2: "Try again, contact your administrator if the error persists."
        });
      })
  }

  const handleTakePhoto = () => {
    const pickerParams = {
      width: 300,
      height: 300,
      cropping: true
    }

    ImagePicker.openPicker(pickerParams)
      .then(setPhoto)
      .catch(() => {
        Toast.show({
          position: "bottom",
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again, contact your administrator in case it persists."
        })
      })
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Create a new pet profile is easy</Text>
      <Text style={styles.sectionText}>Fill the next form with all the relevant information about your pet, select a photo, and that's it. {'\n\n'} A brand new profile with a QRCode will be generated.</Text>

      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={handleTakePhoto} 
          style={styles.imageContainer}
          disabled={petMutation.isLoading}
        >
          {photo
            ? <Image src={photo.path} style={styles.image} />
            : <Text style={styles.imageContainerText}>Select a photo of your pet 🐶!</Text>
          }
        </TouchableOpacity>

        <Formik
          validateOnMount
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {(formikProps: FormikProps<FormValues>) => (
            <View>
              <View style={{width: '100%' }}>
                <Text>Name</Text>
                <TextInput
                  editable={!petMutation.isLoading}
                  placeholder='ex. Remo'
                  style={styles.textInput} 
                  onChangeText={formikProps.handleChange('name')}
                  onBlur={formikProps.handleBlur('name')}
                  value={formikProps.values.name}
                />
              </View>
              <View style={{width: '100%', marginTop: 25 }}>
                <Text>Specie</Text>
                <Dropdown
                  data={species.data || []}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder={'Select specie'}
                  searchPlaceholder="Search..."
                  disable={petMutation.isLoading || species.isLoading}
                  value={selectedSpecie}
                  onChange={(specie: ISpecie) => {
                    formikProps.setFieldValue('specie_id', specie.id)
                    formikProps.setFieldValue('breed_id', undefined)

                    setSelectedSpecie(specie)
                    setSelectedBreed(undefined);

                    triggerGetBreeds(specie.id);
                  }}
                  style={styles.dropdownInput}
                />
              </View>
              <View style={{width: '100%', marginTop: 25 }}>
                <Text>Breed</Text>
                <Dropdown
                  data={breeds.data || []}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder={'Select breed'}
                  searchPlaceholder="Search..."
                  value={selectedBreed}
                  disable={!selectedSpecie || petMutation.isLoading || breeds.isLoading}
                  onChange={(breed: IBreed) => {
                    formikProps.setFieldValue('breed_id', breed.id)
                    setSelectedBreed(breed)
                  }}
                  style={!selectedSpecie 
                    ? [styles.dropdownInput, styles.dropdownInputDisabled] 
                    : styles.dropdownInput
                  }
                />
              </View>
              <View style={{width: '100%', marginTop: 25 }}>
                <Text>Description</Text>
                <TextInput 
                  multiline
                  editable={!petMutation.isLoading}
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange('description')}
                  onBlur={formikProps.handleBlur('description')}
                  value={formikProps.values.description}
                />
              </View>
              <View style={{ width: "100%", marginTop: 25}}>
                <Button
                  disabled={petMutation.isLoading || !formikProps.isValid || !photo}
                  text="Create pet profile"
                  onPress={() => formikProps.handleSubmit()}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  )
};

export default PetCreationView;
