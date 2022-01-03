import { StyleSheet } from 'react-native';
import { COLORS } from 'styles';

export default StyleSheet.create({
  presentation: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.primary_color,
    borderRadius: 12,
    marginTop: 25,
    justifyContent: 'flex-end',
    padding: 25,
    position: 'relative'
  },
  presentationTitle: {
    fontFamily: 'RedHatDisplayBlack',
    fontSize: 24,
    color: '#fff'
  },
  presentationDesc: {
    fontFamily: 'RedHatDisplayRegular',
    fontSize: 14,
    color: '#fff'
  },
  presentationImage: {
    position: 'absolute',
    bottom: 11,
    right: 0,
    height: '150%',
    width: '100%',
    resizeMode: "contain"
  }
})