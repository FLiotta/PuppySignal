import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FD',
  },
  wrapper: {
    paddingHorizontal: 25,
    marginTop: 15,
    width: '100%',
    height: '100%',
  },
  emptyState: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    color: "#6c757d",
    textAlign: 'center'
  },
  petlist: {
    backgroundColor: '#ffffff',
    width: '100%',
    flex: 1,
    flexGrow: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 10,
    paddingHorizontal: 5,
    marginTop: 50
  },
  divisor: {
    width: '75%',
    height: 1,
    marginVertical: 10,
    backgroundColor: "#eeeeee",
    alignSelf: 'center'
  }
});