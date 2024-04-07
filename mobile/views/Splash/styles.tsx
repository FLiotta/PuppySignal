// @Packages
import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '../../styles';

export default StyleSheet.create({
  container: {
    backgroundColor: PRIMARY_COLOR,
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 155,
    height: 115
  },
  name: {
    marginTop: 10,
    fontSize: 40,
    marginLeft: 15,
    fontFamily: 'RedHatDisplayBold',
    color: "#fff"
  },
  googlesignin: {
    marginTop: 25,
    marginBottom: 25,
  },
  footerText: {
    color: "#fff",
    textAlign: 'center'
  }
});