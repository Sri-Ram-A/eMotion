import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000000',
  },
  header: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#FDD835', // bright yellow
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#111111',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF7F', // light green
    elevation: 5,
    shadowColor: '#00FF7F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#444',
    paddingBottom: 6,
    marginBottom: 12,
  },
  field: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FDD835', // yellow text
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    color: '#00FF7F',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: 'Poppins-Italic',
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noData: {
    fontFamily: 'Poppins-Light',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#AAAAAA',
    fontStyle: 'italic',
  },
});

export default styles;
