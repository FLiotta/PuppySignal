// @Packages
import { StyleSheet } from 'react-native';

// @ Project
import { PRIMARY_COLOR, BG_GRAY, PRIMARY_COLOR_LIGHT } from '../../styles';

export default StyleSheet.create({
  container: {
    backgroundColor: BG_GRAY,
    height: '100%',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 30
  },
  title: {
    fontFamily: 'RedHatDisplayBlack',
    fontSize: 32,
    color: PRIMARY_COLOR
  },
  subtitle: {
    fontFamily: 'RedHatDisplayBlack',
    fontSize: 26,
    color: PRIMARY_COLOR,
    marginTop: 15,
    marginBottom: 15
  },
  card: {
    width: '100%',
    paddingVertical: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: 75
  },
  cardBody: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cardAvatar: {
    width: 75,
    height: 75,
    borderRadius: 32,
    position: 'absolute',
    top: -40
  },
  cardAvatarWrapper: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center'
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  cardValue: {
    fontSize: 16
  },
  buttoncta: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: PRIMARY_COLOR_LIGHT,
    borderStyle: "dotted",
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 16,
  }
});