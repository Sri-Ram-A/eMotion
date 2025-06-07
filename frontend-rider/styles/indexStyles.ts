import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FEE140',
    marginBottom: 30,
    letterSpacing: 1.2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  flatList: {
    flexGrow: 0,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 12,
    width: width * 0.75,
    alignItems: 'center',
    shadowColor: '#39FF14',
    shadowOpacity: 0.65,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39FF14',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#FEE140',
    paddingVertical: 16,
    borderRadius: 35,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#FEE140',
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});

export default styles;
