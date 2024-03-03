// @Packages
import * as yup from 'yup';
import { View, Text, TextInput } from 'react-native';
import { Formik, FormikProps } from 'formik';

// @Project
import Button from '../../components/Button';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../api/profile';

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
  const { data: profile } = useGetProfileQuery();
  const [triggerUpdateProfileMutation, updateProfileMutation] = useUpdateProfileMutation();

  const initialValues: FormValues = {
    first_name: '',
    last_name: '',
    phone_number: ''
  }


  // TODO: Validar que solo UNO de algunos de estos fields este setado.
  const validationSchema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    phone_number: yup.string().required(),
  });


  const handleFormSubmit = (formValues: FormValues) => {
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
        <Formik
          validateOnMount
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {(formikProps: FormikProps<FormValues>) => (
            <View>
              <View style={{width: '100%' }}>
                <Text>Firstname</Text>
                <TextInput
                  placeholder={profile?.first_name}
                  style={styles.textInput} 
                  onChangeText={formikProps.handleChange('first_name')}
                  onBlur={formikProps.handleBlur('first_name')}
                />
              </View>
              <View style={{width: '100%', marginTop: 25, }}>
                <Text>Lastname</Text>
                <TextInput
                  placeholder={profile?.last_name}
                  style={styles.textInput} 
                  onChangeText={formikProps.handleChange('last_name')}
                  onBlur={formikProps.handleBlur('last_name')}
                />
              </View>
              <View style={{width: '100%', marginTop: 25, }}>
                <Text>Phone number</Text>
                <TextInput
                  placeholder={profile?.phone_number}
                  style={styles.textInput} 
                  onChangeText={formikProps.handleChange('phone_number')}
                  onBlur={formikProps.handleBlur('phone_number')}
                />
              </View>
              <View style={{ height: 50, marginTop: 40 }}>
                <Button
                  text='Update profile'
                  disabled={updateProfileMutation.isLoading || !formikProps.isValid}
                  onPress={() => formikProps.handleSubmit()}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  )
}

export default ProfileEditView;