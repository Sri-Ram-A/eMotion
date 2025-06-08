import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#000000', // black background for whole screen
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: '#121212', // very dark gray for card
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#00ff00', // neon green shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#ffff00', // bright yellow border
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00ff00', // neon green
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffff00', // yellow border for indicator
  },
  statusText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffff00', // bright yellow text
    marginBottom: 8,
    fontFamily: 'Arial Black' // strong, bold font
  },
  statusSubtext: {
    fontSize: 16,
    color: '#a0ff00', // bright lime green
    fontWeight: '600',
    fontFamily: 'Verdana',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)', // darker overlay for modal
  },
  modalView: {
    backgroundColor: '#121212', // dark background
    borderRadius: 20,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#00ff00', // neon green border
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 24,
    color: '#ffff00',
    textAlign: 'center',
    fontFamily: 'Arial Black',
  },
  rideDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444400',
  },
  priceDistanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: '#666600',
  },
  priceDistanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#aaff00',
    marginBottom: 6,
    fontFamily: 'Verdana',
  },
  value: {
    fontSize: 17,
    color: "white",
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
    fontFamily: 'Verdana',
  },
  highlightValue: {
    fontSize: 18,
    color: "white",
    fontWeight: '700',
    fontFamily: 'Arial',
  },
  priceValue: {
    fontSize: 20,
    color: '#ffff00',
    fontWeight: '900',
    fontFamily: 'Arial Black',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ccff33',
    fontFamily: 'Verdana',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#00ff00',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  acceptButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Arial Black',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "red",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffff00',
  },
  rejectButtonText: {
    color: '#ffff00',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Verdana',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  rideProgressCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 36,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#ffff00',
  },
  rideProgressTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffff00',
    marginBottom: 36,
    textAlign: 'center',
    fontFamily: 'Arial Black',
  },
  mapPlaceholder: {
    backgroundColor: '#222200',
    borderRadius: 20,
    padding: 56,
    marginBottom: 36,
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderColor: '#00ff00',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 22,
    color: '#aaff00',
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: 'Verdana',
  },
  mapSubtext: {
    fontSize: 16,
    color: '#99cc33',
  },
  completeButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 20,
    paddingHorizontal: 52,
    borderRadius: 16,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Arial Black',
  },
});

export default styles;