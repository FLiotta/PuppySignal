import { StyleSheet } from "react-native";
import { COLORS } from 'styles'

export default StyleSheet.create({
  body: {
    padding: 25,
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative'
  },
  header: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerBackground: {
    width: '150%',
    aspectRatio: 1/1,
    left: "-4%",
    bottom: 0,
    borderRadius: 1000,
    backgroundColor: COLORS.primary_color,
    position: 'absolute',
    alignSelf: 'center',
  },
  petPhoto: {
    width: 125,
    height: 125,
    borderRadius: 40,
    backgroundColor: '#ffffff',
  },
  divider: {
    width: '80%', 
    height: 1, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.primary_color, 
    alignSelf: 'center', 
    marginVertical: 25
  }
});