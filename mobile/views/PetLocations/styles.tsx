import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles';

const LOCATION_BUBBLES_SIZE = 45;

export default StyleSheet.create({
  selectedLocation: {
    borderRadius: 16,
    elevation: 15,
    width: '70%',
    height: 250,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 25,
    left: 25,
    padding: 15,
    justifyContent: 'center'
  },
  container: {
    backgroundColor: COLORS.bg_color,
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  locationsList: {
    position: 'absolute',
    bottom: 0,
    right: 25,
    maxHeight: (LOCATION_BUBBLES_SIZE + 37) * 5,
    overflow: 'scroll',
  },
  location: {
    width: LOCATION_BUBBLES_SIZE,
    height: LOCATION_BUBBLES_SIZE,
    borderRadius: 50,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 15,
    backgroundColor: '#ffffff'
  },
  locationImage: {
    width: 25,
    height: 25,
    marginRight: 35,
  }
});