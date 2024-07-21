// @Packages
import { StyleSheet } from 'react-native';

// @ Project
import { PRIMARY_COLOR, BG_GRAY } from '../../styles';

export default StyleSheet.create({
  container: {
    backgroundColor: BG_GRAY,
    height: '100%',
    width: '100%',
    padding: 15
  },
  sectionTitle: {
    fontFamily: 'RedHatDisplayBlack',
    fontSize: 20,
    color: PRIMARY_COLOR,
    marginTop: 15,
    marginBottom: 15
  },
  sectionText: {
    fontFamily: 'RedHatDisplayBlack',
    color: PRIMARY_COLOR,
    marginBottom: 15
  },
  formContainer: {
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginTop: 30,
    marginBottom: 50,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  imageContainerText: {
    textAlign: 'center',
    color: PRIMARY_COLOR
  },
  imageContainer: {
    padding: 10,
    width: '100%',
    aspectRatio: 1/1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: PRIMARY_COLOR,
    borderStyle: "dashed",
    marginBottom: 25,
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
    borderColor: '#eee',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 45,
    maxHeight: 200,
    color: '#000',
    zIndex: 100000
  },
  dropdownInput: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#4444',
    borderRadius: 5,
    marginTop: 8,
    backgroundColor: "#fff"
  },
  dropdownInputDisabled: {
    backgroundColor: "#eee"
  }
});
