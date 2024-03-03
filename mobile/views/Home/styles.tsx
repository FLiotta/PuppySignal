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
  notificationsView: {
    marginBottom: 55,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  notificationEmptyStatus: {
    width: 125,
    height: 225,
    marginTop: 50
  },
  notificationsEmptyText: {
    fontFamily: 'RedHatDisplayBlack',
    fontSize: 15,
    color: PRIMARY_COLOR,
    marginTop: 5,
  }
});