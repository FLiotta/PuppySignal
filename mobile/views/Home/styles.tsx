import { StyleSheet } from 'react-native';
import { COLORS } from 'styles';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.bg_color,
  },
  wrapper: {
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  header: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 22,
    color: COLORS.primary_color,
    fontFamily: 'RedHatDisplayRegular',
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 20
  },
  activity: {
    width: '100%',
    flex: 1,
    marginTop: 25,
  },
  activityTitle: {
    fontWeight: '400',
    fontFamily: 'RedHatDisplayRegular',
    fontSize: 20,
    marginBottom: 25
  },
  activityBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
})