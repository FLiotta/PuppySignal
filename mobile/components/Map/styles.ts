// @ Packages
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  selectedLocationContainer: {
    position: "absolute",
    top: 0,
    width: '100%',
    padding: 15
  },
  selectedLocation: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  selectedLocationClose: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 50,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selectedLocationData: {
    justifyContent: "center"
  },
  locationsList: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    maxHeight: (32 + 37) * 5,
    overflow: 'scroll'
  },
  location: {
    width: 32,
    height: 32,
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
  },
  locationIdContainer: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
    bottom: 7
  },
  locationId: {
    fontWeight: '700'
  },
})
