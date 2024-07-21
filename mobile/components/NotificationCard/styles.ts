// @ Packages
import { StyleSheet } from "react-native";

// @ Project
import { PRIMARY_COLOR } from "../../styles";

export default StyleSheet.create({
  activityCard: {
    width: '100%',
    minHeight: 75,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  activityCardIcon: {
    height: 50,
    width: 50,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityCardTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: "#0d0d0d"
  },
  activityCardSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: "#0d0d0d"
  },
});
