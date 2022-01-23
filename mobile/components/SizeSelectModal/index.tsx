// @Packages
import React from 'react';
import { View, Text, StyleSheet, Button, TextInput,  } from 'react-native'
import Modal from "react-native-modal";
import { Formik } from 'formik';

interface IProps {
  onSubmit: (w: number,h: number) => void;
  onClose: () => void;
  isVisible: boolean,
  title: string
}

const SizeSelectModal: React.FC<IProps> = ({
  onSubmit,
  onClose,
  isVisible,
  title
}) => {
  const initialValues = {
    height: "2.5", 
    width: "2.5" 
  }

  interface FormPayload {
    height: any,
    width: any
  }

  const handleSubmit = (formPayload: FormPayload) => {
    const height = parseFloat(formPayload.height);
    const width = parseFloat(formPayload.width);

    onSubmit(width, height);
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
          A PDF file will be created with an image of your code
          following the width and height you provide*. 
          {'\n'}{'\n'}
          This way you'll only need to print it.
          {'\n'}{'\n'}
          Metrics are expressed in centimeters.
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '45%', position: "relative"}}>
                <Text>Height</Text>
                <Text style={{ position: 'absolute', right: 10, top: 37, zIndex: 1000, color: '#e1e1e1' }}>cm</Text>
                <TextInput
                  style={styles.textInput} 
                  onChangeText={handleChange('height')}
                  onBlur={handleBlur('height')}
                  keyboardType='numeric'
                  value={values.height}
                />
              </View>
              <View style={{width: '45%', position: 'relative'}}>
                <Text>Width</Text>
                <Text style={{ position: 'absolute', right: 10, top: 37, zIndex: 1000, color: '#e1e1e1' }}>cm</Text>
                <TextInput
                  style={styles.textInput} 
                  onChangeText={handleChange('width')}
                  onBlur={handleBlur('width')}
                  keyboardType='numeric'
                  value={values.width}
                />
              </View>
            </View>
            <Text style={{
              marginTop: 15,
              fontSize: 12
            }}>
              * Size may not be exact once printed, feature is still in development
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
              <Button
                title="Close"
                onPress={onClose}
              />
              <Button
                title="Generate"
                onPress={handleSubmit}
              />
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
    minHeight: 45,
    color: '#000',
  },
});

export default SizeSelectModal;