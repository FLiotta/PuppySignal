// @ Packages
import { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

// @ Project
import Button from '../../components/Button';
import { PetStackParamList } from '../PetStack';
import { IBreed, ISpecie } from '../../interfaces';
import { useGetSpeciesQuery, useLazyGetBreedsQuery } from '../../api/data';
import { ICreatePetArgs, useCreatePetMutation } from '../../api/pet';

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

  const formSchema = z.object({
    description: z.string().min(5),
    name: z.string().min(2),
    specie_id: z.number().min(0),
    breed_id: z.number()
  })

  const { control, handleSubmit, formState, resetField } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      specie_id: -1,
      breed_id: -1
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (formData: FormValues) => {
    if(!photo) return

    const { name, description, breed_id, specie_id } = formData;

    const createPetParams: ICreatePetArgs = {
      name,
      description,
      specie_id,
      file: {
        uri: photo.path,
        mime: photo.mime
      }
    }

    if (breed_id !== -1) {
      createPetParams["breed_id"] = breed_id
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

        <Controller
          control={control}
          name="name"
          render={({field: { onChange, onBlur, value}}) => (
            <View style={{width: '100%' }}>
              <Text>Name</Text>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={(_value) => onChange(_value)}
                onBlur={onBlur}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="specie_id"
          render={({field: { onChange }}) => (
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
                  onChange(specie.id);
                  setSelectedSpecie(specie);

                  // When we change the specie, we should reset the breed_id in case there was one already
                  // and request the new breeds for given specie
                  resetField('breed_id')
                  setSelectedBreed(undefined);
                  triggerGetBreeds(specie.id);
                }}
                style={styles.dropdownInput}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="breed_id"
          render={({field: { onChange }}) => (
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
                  onChange(breed.id)
                  setSelectedBreed(breed)
                }}
                style={!selectedSpecie
                  ? [styles.dropdownInput, styles.dropdownInputDisabled]
                  : styles.dropdownInput
                }
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({field: { onChange, onBlur, value}}) => (
            <View style={{width: '100%', marginTop: 25 }}>
              <Text>Description</Text>
              <TextInput
                multiline
                editable={!petMutation.isLoading}
                style={styles.textInput}
                value={value}
                onChangeText={(_value) => onChange(_value)}
                onBlur={onBlur}
              />
            </View>
          )}
        />

        <View style={{ width: "100%", marginTop: 25}}>
          <Button
            disabled={petMutation.isLoading || !formState.isValid || !photo}
            text="Create pet profile"
            onPress={handleSubmit(onSubmit)}
          />
        </View>

      </View>
    </ScrollView>
  )
};

export default PetCreationView;
