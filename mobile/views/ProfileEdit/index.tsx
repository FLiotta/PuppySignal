// @Packages
import { View, Text, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// @Project
import Button from '../../components/Button';
import { useUpdateProfileMutation } from '../../api/profile';

// @Own
import styles from './styles';
import Toast from 'react-native-toast-message';
import { ProfileStackParamList } from '../ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type IProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileEdit'>;

interface FormValues {
  first_name?: string,
  last_name?: string,
  phone_number?: string
}

const ProfileEditView: React.FC<IProps> = ({ navigation }) => {
  const formSchema = z
    .object({
      first_name: z.string(),
      last_name: z.string(),
      phone_number: z.string()
    })
    .partial()
    .refine(({ first_name, last_name, phone_number }) => first_name || last_name || phone_number)
  
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
    },
    reValidateMode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const [triggerUpdateProfileMutation, updateProfileMutation] = useUpdateProfileMutation();

  const onSubmit = (formValues: FormValues) => {
    triggerUpdateProfileMutation(formValues)
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Profile updated",
          text2: "The modifications were applied with success.",
          position: "bottom"
        })

        navigation.navigate("Profile");
      })
      .catch((e) => {
        console.error(e);

        Toast.show({
          type: "error",
          text1: "Something went wrong.",
          text2: "Please try again later, contact an administrator if the problem persists ",
          position: "bottom"
        })
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionText}>
        This information will be shown when someone scan your pets tags.
      </Text>

      <View style={styles.card}>
        <Controller
          control={control}
          name="first_name"
          render={({field: { onChange, onBlur, value}}) => (
            <View style={{width: '100%' }}>
              <Text>Firstname</Text>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={(_value) => onChange(_value)}
                onBlur={onBlur}
                maxLength={20}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({field: { onChange, onBlur, value}}) => (
            <View style={{width: '100%', marginTop: 25 }}>
              <Text>Lastname</Text>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={(_value) => onChange(_value)}
                onBlur={onBlur}
                maxLength={20}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="phone_number"
          render={({field: { onChange, onBlur, value}}) => (
            <View style={{width: '100%', marginTop: 25 }}>
              <Text>Phone number</Text>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={(_value) => onChange(_value)}
                onBlur={onBlur}
                keyboardType='numeric'
                maxLength={50}
              />
            </View>
          )}
        />
        <View style={{ height: 50, marginTop: 40 }}>
          <Button
            text='Update profile'
            disabled={updateProfileMutation.isLoading || !formState.isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </View>
  )
}

export default ProfileEditView;
