import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#000000', // changed to pure black
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
        color: '#a3e635',  // bright green-yellow (lime green)
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 24,
        marginTop: 8,
    },
    inputLabel: {
        color: '#fde68a',  // soft yellow
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#121212',  // dark but not full black for input background
        color: '#a3e635',  // green text
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#65a30d',  // darker green border
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    button: {
        backgroundColor: '#a3e635',  // bright green button bg
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: '#b45309',  // darker yellow/brown for secondary button
    },
    buttonText: {
        color: '#000000',  // black text on bright green/yellow button
        fontSize: 16,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: '#121212',  // dark card background
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#65a30d',  // dark green border
    },
    detailsTitle: {
        color: 'red', // bright green
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
        color: 'pink', // soft yellow
        fontSize: 16,
    },
    detailValue: {
        color: 'yellow', // bright green
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000', // black background for modal
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
        color: '#a3e635', // bright green
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#fde68a', // soft yellow
    },
    driverCard: {
        backgroundColor: '#121212', // dark card bg
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#65a30d', // dark green border
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#eab308', // yellow gold
        fontSize: 16,
        fontWeight: '500',
        marginRight: 4,
    },
    ratingIcon: {
        color: '#eab308', // yellow gold
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#65a30d', // darker green
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    closeButtonText: {
        color: '#000000',  // black text for contrast on green
        fontSize: 16,
        fontWeight: '600',
    },
    ratingInputContainer: {
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: '#121212',
        color: '#a3e635',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#65a30d',
    },
    ratingTitle: {
        color: '#a3e635',
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
        backgroundColor: '#a3e635',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    driverCardTitle: {
        color: '#a3e635',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#65a30d',
    },
});
export default styles