import { Text, View, Modal, ScrollView, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
import { router } from "expo-router"
import * as types from "@/types"

function CheckBox({ label, value, onChange }: { label: string, value: boolean, onChange: (val: boolean) => void }) {
    return (
        <Pressable 
            style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 12,
                padding: 8,
                borderRadius: 8,
                backgroundColor: value ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
            }}
            onPress={() => onChange(!value)}
        >
            <View style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: value ? '#22c55e' : '#64748b',
                backgroundColor: value ? '#22c55e' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
            }}>
                {value && (
                    <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
                )}
            </View>
            <Text style={{ color: '#e2e8f0', fontSize: 16 }}>{label}</Text>
        </Pressable>
    );
}

export default function AboutScreen() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [driverMessage, setDriverMessage] = useState<types.TwoDriverDetails | string>('');
    const [driver_id, setDriverId] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [ride_rating, setRideRating] = useState("2");
    const [review_cleanliness, setCleanliness] = useState(false);
    const [review_discipline, setDiscipline] = useState(false);
    const [review_friendly, setFriendly] = useState(false);
    const [review_safety, setSafety] = useState(false);
    const [review_arrive_on_time, setOnTime] = useState(false);
    const [favourite, setFavourite] = useState(false);
    const [rideCompleted, setRideCompleted] = useState(false);
    const [priceDetails, setPriceDetails] = useState<types.RiderData | string>("");
    const [showRatingModal, setShowRatingModal] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const { id } = useContext(IDContext);

    useEffect(() => {
        ws.current = new WebSocket(api.SOCKET +"split_rides/"+ id);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            try {
                const parsed = JSON.parse(e.data);
                if (parsed.price_details === "1") {
                    setPriceDetails(parsed);
                }
                else if (parsed.review === "1") {
                    setDriverMessage("Ride Completed");
                    setDriverId(parsed.driver_id);
                    setRideCompleted(true);
                    setShowRatingModal(true); // Show rating modal when ride is completed
                } else {
                    setDriverMessage(parsed || "No message provided.");
                    setDriverId(parsed.driver_id);
                    setRideCompleted(false);
                    setModalVisible(true); // Show driver details modal
                }
            } catch {
                setDriverMessage(e.data);
                setRideCompleted(false);
                setModalVisible(true);
            }
        };

        ws.current.onerror = (e: Event) => {
            console.error("WebSocket error:", e);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const handleSubmit = () => {
        if (!source.trim() || !destination.trim()) {
            alert("Please enter both source and destination.");
            return;
        }
        const message = { source, destination };
        ws.current?.send(JSON.stringify(message));
    };

    const handlePriceSubmit = () => {
        if (!source.trim() || !destination.trim()) {
            alert("Please enter both source and destination.");
            return;
        }
        const message = { "price": "1", source, destination };
        ws.current?.send(JSON.stringify(message));
    };
    const handleReviewSubmit = () => {
        const message = {
            "review": "1",
            driver_id,
            source,
            destination,
            favourite,
            ride_rating,
            review_cleanliness,
            review_discipline,
            review_friendly,
            review_safety,
            review_arrive_on_time,
        };
        console.log(message);
        ws.current?.send(JSON.stringify(message));
        setShowRatingModal(false);
        router.replace("/");
    };
    return (
        <View style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Ride Details</Text>
                    
                    <Text style={styles.inputLabel}>Pickup Location</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSource}
                        value={source}
                        placeholder="Where are you now?"
                        placeholderTextColor="#94a3b8"
                    />
                    
                    <Text style={styles.inputLabel}>Destination</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setDestination}
                        value={destination}
                        placeholder="Where are you going?"
                        placeholderTextColor="#94a3b8"
                    />
                    
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            onPress={handlePriceSubmit}
                            style={[styles.button, styles.secondaryButton]}
                        >
                            <Text style={styles.buttonText}>Get Price Estimate</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Find a Driver</Text>
                        </TouchableOpacity>
                    </View>

                    {typeof priceDetails == 'object' && (
                        <View style={styles.detailsCard}>
                            <Text style={styles.detailsTitle}>Price Breakdown</Text>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>From:</Text>
                                <Text style={styles.detailValue}>{priceDetails.source_details}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>To:</Text>
                                <Text style={styles.detailValue}>{priceDetails.destination_details}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Distance:</Text>
                                <Text style={styles.detailValue}>{priceDetails.distance} km</Text>
                            </View>
                            
                            <View style={[styles.detailRow, { marginTop: 16 }]}>
                                <Text style={[styles.detailLabel, { fontSize: 18 }]}>Total Price:</Text>
                                <Text style={[styles.detailValue, { fontSize: 18, color: '#22c55e' }]}>{priceDetails.price} ₹</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Driver Details Modal */}
<Modal
    animationType="slide"
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Drivers Found!</Text>
            <Text style={styles.modalSubtitle}>Your drivers details</Text>
        </View>
        
        {driverMessage && typeof driverMessage === 'object' && (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {/* Driver 1 Card */}
                <View style={[styles.driverCard, { marginBottom: 24 }]}>
                    <Text style={styles.driverCardTitle}>Driver 1</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver1.name}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver1.phone_number}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rating:</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>{driverMessage.driver1.rating}</Text>
                            <Text style={styles.ratingIcon}>★</Text>
                        </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver1.vehicle_plate}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver1.email}</Text>
                    </View>
                </View>

                {/* Driver 2 Card */}
                <View style={styles.driverCard}>
                    <Text style={styles.driverCardTitle}>Driver 2</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver2.name}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver2.phone_number}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rating:</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>{driverMessage.driver2.rating}</Text>
                            <Text style={styles.ratingIcon}>★</Text>
                        </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver2.vehicle_plate}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{driverMessage.driver2.email}</Text>
                    </View>
                </View>
            </ScrollView>
        )}
        
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
        >
            <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
</Modal>

{/* Rating Modal */}
<Modal
    animationType="slide"
    transparent={false}
    visible={showRatingModal}
    onRequestClose={() => setShowRatingModal(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            {/* <Text style={styles.modalSubtitle}>
                {driverMessage && typeof driverMessage === 'object' && 
                    `How was your ride with ${driverMessage.driver1.name}?`}
            </Text> */}
        </View>
        
        <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.ratingInputContainer}>
                <Text style={styles.inputLabel}>Rating (1-5)</Text>
                <TextInput
                    style={styles.modalInput}
                    placeholder="Enter 1-5"
                    value={ride_rating}
                    onChangeText={setRideRating}
                    keyboardType="numeric"
                    maxLength={1}
                />
            </View>

            <Text style={styles.ratingTitle}>What was great about {driverMessage && typeof driverMessage === 'object' ? driverMessage.driver1.name + "'s" : "this"} ride?</Text>
            
            <View style={styles.checkboxGroup}>
                <CheckBox label="Cleanliness" value={review_cleanliness} onChange={setCleanliness} />
                <CheckBox label="Discipline" value={review_discipline} onChange={setDiscipline} />
                <CheckBox label="Friendly Driver" value={review_friendly} onChange={setFriendly} />
                <CheckBox label="Safe Driving" value={review_safety} onChange={setSafety} />
                <CheckBox label="Arrived on Time" value={review_arrive_on_time} onChange={setOnTime} />
                <CheckBox label="Add to Favorites" value={favourite} onChange={setFavourite} />
            </View>
            
            <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.secondaryButton]}
                    onPress={() => setShowRatingModal(false)}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleReviewSubmit}
                >
                    <Text style={styles.buttonText}>Submit Review</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
</Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
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
        color: '#f8fafc',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 24,
        marginTop: 8,
    },
    inputLabel: {
        color: '#e2e8f0',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    button: {
        backgroundColor: '#22c55e',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: '#334155',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    detailsTitle: {
        color: '#f8fafc',
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
        color: '#94a3b8',
        fontSize: 16,
    },
    detailValue: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
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
        color: '#f8fafc',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
    },
    driverCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#facc15',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 4,
    },
    ratingIcon: {
        color: '#facc15',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#334155',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    closeButtonText: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: '600',
    },
    ratingInputContainer: {
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    ratingTitle: {
        color: '#e2e8f0',
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
        backgroundColor: '#22c55e',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    driverCardTitle: {
        color: '#f8fafc',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
});