// @Packages
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';

// @Project
import { COLORS } from '../../styles';
import { selectAppSpecies } from 'selectors/app';

interface IProps {
  onBack(): void
  onConfirm(payload: any): void,
  loading: boolean
}

interface ToSubmit {
  name: string,
  description: string,
  specie_id: number
}

const Step2: React.FC<IProps> = ({ onBack, onConfirm, loading }) => {
  const formInitialValues = {
    name: '',
    description: '', 
    specie_id: 0 
  };

  const species: any = useSelector(selectAppSpecies).map((specie) => ({
    label: specie.name,
    value: specie.id
  }))

  const [specieDropdownOpen, setSpecieDropdownOpen] = useState<boolean>(false);
  const [selectedSpecie, setSelectedSpecie] = useState<any>(null)

  const handleSubmit = (payload: ToSubmit) => {
    onConfirm({
      name: payload.name,
      description: payload.description,
      specie_id: payload.specie_id
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          We need you to provide some basic information about your pet before finishing the process.
        </Text>
        <Text style={styles.headerSubtitle}>You can always edit your pet's information after submitted ✏️</Text>
      </View>
      <Formik
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit,setFieldValue, values }) => (
          <>
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '45%',}}>
                <Text>Name</Text>
                <TextInput
                  placeholder="Name" 
                  style={styles.textInput} 
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
              </View>
              <View style={{width: '45%',}}>
                <Text>Specie</Text>
                <DropDownPicker
                  items={species}
                  multiple={false}
                  onSelectItem={item => {
                    setFieldValue('specie_id', item.value)
                  }}
                  value={selectedSpecie}
                  setValue={setSelectedSpecie}
                  open={specieDropdownOpen}
                  setOpen={setSpecieDropdownOpen}
                  closeAfterSelecting
                />
              </View>
            </View>
            <View style={{marginTop: 25}}>
              <Text>Description</Text>
              <TextInput 
                multiline
                style={styles.textInput}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
              <Button
                disabled={loading}
                title="Go back"
                onPress={onBack}
                color={COLORS.primary_color}
              />
              <Button
                disabled={loading}
                title="Create"
                onPress={() => handleSubmit()}
                color={COLORS.primary_color}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#F8F9FD',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  header: {
    width: '100%',
  },
  headerTitle: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary_color,
    fontFamily: 'RedHatDisplayRegular',
  },
  headerSubtitle: {
    textAlign: 'left',
    color: COLORS.primary_color_darker,
    fontFamily: 'RedHatDisplayRegular',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  imageContainerText: {
    textAlign: 'center',
    color: COLORS.primary_color
  },
  imageContainer: {
    padding: 10,
    width: 275,
    height: 275,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 50,
    borderWidth: 5,
    borderColor: COLORS.primary_color,
    borderStyle: "dashed"
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
  selectInput: {
    borderWidth: 1,
    borderColor: '#4444',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 45,
    color: '#000',
    zIndex: 100000
  }
});

export default Step2;