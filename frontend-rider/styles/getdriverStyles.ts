import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: '#ADFF2F', // Yellow-green
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    marginTop: 8,
  },
  inputLabel: {
    color: '#ADFF2F',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#7CFC00', // Lawn green
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  button: {
    backgroundColor: '#7CFC00', // Green
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#facc15',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#444',
  },
  detailsTitle: {
    color: '#FFFF00', // Bright yellow
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#7CFC00',
    fontSize: 16,
  },
  detailValue: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ADFF2F',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFFF00',
  },
  driverCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#444',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  ratingIcon: {
    color: '#FFFF00',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  closeButtonText: {
    color: '#ADFF2F',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingInputContainer: {
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#1a1a1a',
    color: '#7CFC00',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  ratingTitle: {
    color: '#ADFF2F',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  checkboxGroup: {
    marginBottom: 24,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#7CFC00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
});
