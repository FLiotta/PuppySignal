// @Packages
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FD',
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 155,
    height: 110
  },
  name: {
    marginTop: 10,
    fontSize: 40,
    marginLeft: 15,
    fontFamily: 'RedHatDisplayBold',
    color: "#6377e4"
  },
  googlesignin: {
    position: "absolute",
    bottom: 50,
    flex: 1,
    alignItems: "center",
    width: '80%'
  },
  footerText: {
    marginTop: 10,
    color: "#6377e4",
    textAlign: 'center',
    fontFamily: 'RedHatDisplayBold',
    flexWrap: 'wrap'
  }
});