// @Packages
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput,  } from 'react-native'
import Modal from "react-native-modal";
import { Formik } from 'formik';

// @Project
import { IUser } from 'interfaces';

export interface FormPayload {
  first_name: string,
  last_name: string
}

interface IProps {
  onSubmit: (payload: FormPayload) => Promise<void>;
  onClose: () => void;
  isVisible: boolean,
  title: string,
  profile: Partial<IUser>
}

const SizeSelectModal: React.FC<IProps> = ({
  onSubmit,
  onClose,
  isVisible,
  title,
  profile
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues = {
    first_name: profile.first_name, 
    last_name: profile.last_name,
  }

  const handleSubmit = (payload: FormPayload) => {
    setLoading(true);

    onSubmit(payload)
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      })
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text>
          Update your profile basic information.
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '45%', position: "relative"}}>
                <Text>First name</Text>
                <TextInput
                  style={styles.textInput} 
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                />
              </View>
              <View style={{width: '45%', position: "relative"}}>
                <Text>Last name</Text>
                <TextInput
                  style={styles.textInput} 
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 45}}>
              <Button
                disabled={loading}
                title="Close"
                onPress={onClose}
              />
              <View style={{ marginLeft: 15 }}>
                <Button
                  disabled={loading}
                  title="Submit"
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          </>
        )}
      </Formik>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 25,
    borderRadius: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginVertical: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#4444',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
    color: '#000',
  },
});

export default SizeSelectModal;