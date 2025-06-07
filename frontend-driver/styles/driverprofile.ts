import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#000000",
  },
  header: {
    fontSize: 32,
    fontFamily: "Poppins-ExtraBold",
    color: "#F57C00", // saffron
    marginBottom: 1,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  section: {
    backgroundColor: "#111111",
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 25,
    elevation: 7,
    shadowColor: "#00FF00",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#008000", // green from flag
  },
  sectionHeader: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#444",
    paddingBottom: 6,
    marginBottom: 6,
  },
  animatedField: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#39FF14",
  },
  field: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#E0E0E0",
    fontWeight: "600",
  },
  label: {
    fontFamily: "Poppins-SemiBold",
    color: "#FEE140",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontFamily: "Poppins-Italic",
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 20,
    fontSize: 17,
  },
  noData: {
    fontFamily: "Poppins-Light",
    textAlign: "center",
    marginTop: 20,
    fontSize: 17,
    color: "#AAAAAA",
    fontStyle: "italic",
  },
});

export default styles;
