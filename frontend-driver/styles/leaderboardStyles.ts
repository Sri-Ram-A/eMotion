// frontend-driver/styles/leaderboardStyles.ts

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000000", 
  },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FEE140", 
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  rideCard: {
    backgroundColor: "#111111",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 5,
    shadowColor: "#28B463",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#28B463", // green
  },
  rideTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FEE140",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#AAAAAA",
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  value: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
  rating: {
    color: "#39FF14",
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 20,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 17,
    color: "#AAAAAA",
    fontStyle: "italic",
    fontFamily: "Poppins-Regular",
  },
});

export default styles;
