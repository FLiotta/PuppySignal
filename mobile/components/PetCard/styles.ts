// @Packages
import { StyleSheet } from "react-native";

// @ Project
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../../styles";

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  container: {
    position: "relative",
    width: '100%',
    height: '100%',
    padding: 15,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    fontSize: 12,
    color: '#444',
    marginLeft: 4,
  },
  specieBadge: {
    textAlign: 'center',
    textAlignVertical: 'center',
    position: 'absolute',
    top: -8,
    right: -5,
    padding: 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    fontSize: 15,
  },
  photoContainer: {
    position: 'relative',
    width: 50,
    alignItems: 'center'
  },
  photo: {
    borderRadius: 12,
    width: 50,
    height: 50
  },
  name: {
    fontSize: 15,
    fontWeight: "700"
  },
  missing: {
    color: "red"
  },
  description: {
    color: "#3a3a3a",
    maxWidth: '75%',
    flexWrap: 'wrap',
  },
  right: {
    flex: 1,
    paddingLeft: 20,
    position: 'relative',
    justifyContent: 'flex-start'
  },
  QRCodeWrap: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "red",
    right: 20,
  },
  QRCode: {
    position: 'absolute',
    fontSize: 25,
    padding: 7,
    bottom: 10,
    paddingHorizontal: 10,
    backgroundColor: PRIMARY_COLOR_LIGHT,
    color: PRIMARY_COLOR,
    borderRadius: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});
