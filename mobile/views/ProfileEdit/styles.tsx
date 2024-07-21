// @Packages
import { StyleSheet } from 'react-native';

// @ Project
import { PRIMARY_COLOR, BG_GRAY } from '../../styles';

export default StyleSheet.create({
  container: {
    backgroundColor: BG_GRAY,
    height: '100%',
    width: '100%',
    paddingHorizontal: 15,
  },
  sectionText: {
    fontFamily: 'RedHatDisplayBlack',
    color: PRIMARY_COLOR,
    marginBottom: 15,
    marginTop: 50,
  },
  card: {
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 25,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#4444',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 45,
    color: '#000',
  },
});
