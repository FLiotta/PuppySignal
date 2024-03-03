import { StyleSheet } from "react-native";
import { BG_GRAY, PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../../styles";

export default StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: BG_GRAY,
    justifyContent: "center",
    alignItems: "center"
  },
  codeCard: {
    position: 'relative',
    padding: 50,
    borderRadius: 8,
    height: 325,
    width: 250,
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: "center"
  },
  qrText: {
    color: PRIMARY_COLOR,
    fontFamily: "RedHatDisplayBlack",
    fontSize: 20,
    marginTop: 12
  },
  button: {
    backgroundColor: PRIMARY_COLOR_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    height: 40,
    width: 65,
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    width: "100%",
    height: 250,
    justifyContent: "space-between",
    marginTop: 25,
  },
  paginator: {
    marginTop: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 250,
    maxHeight: 50
  }
});