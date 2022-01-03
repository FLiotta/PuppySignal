import { StyleSheet } from "react-native";
import { COLORS } from 'styles'

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: 25,
    paddingTop: 75,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.bg_color
  },
  profileCard: {
    width: '100%',
    paddingVertical: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative'
  },
  profileCardBody: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileCardAvatar: {
    width: 75,
    height: 75,
    borderRadius: 32,
    position: 'absolute',
    top: -40
  },
  profileCardAvatarWrapper: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center'
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  value: {
    fontSize: 16
  },
  buttoncta: {
    paddingVertical: 10
  }
});