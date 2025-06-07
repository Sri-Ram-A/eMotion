import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FEE140',
    marginBottom: 36,
    letterSpacing: 1.2,
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: '#39FF14',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  flatList: {
    flexGrow: 0,
    marginBottom: 48,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
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
    height: 170,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#39FF14',
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Lato_400Regular',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#FEE140',
    paddingVertical: 18,
    borderRadius: 35,
    marginVertical: 14,
    alignItems: 'center',
    shadowColor: '#FEE140',
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
});

export default styles;
