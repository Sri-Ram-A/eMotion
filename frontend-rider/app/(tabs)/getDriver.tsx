import { Text, View, Modal, ScrollView, RefreshControl, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
import { router } from "expo-router"
function CheckBox({ label, value, onChange }: { label: string, value: boolean, onChange: (val: boolean) => void }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Button
                title={value ? "☑" : "☐"}
                onPress={() => onChange(!value)}
                color="#22c55e"
            />
            <Text style={{ color: '#fff', marginLeft: 8 }}>{label}</Text>
        </View>
    );
}

export default function AboutScreen() {
    const [refreshing, setRefreshing] = React.useState(false);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [driverMessage, setDriverMessage] = useState('');
    const [driver_id, setDriverId] = useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [ride_rating, setRideRating] = useState("2");
    const [review_cleanliness, setCleanliness] = useState(false);
    const [review_discipline, setDiscipline] = useState(false);
    const [review_friendly, setFriendly] = useState(false);
    const [review_safety, setSafety] = useState(false);
    const [review_arrive_on_time, setOnTime] = useState(false);
    const [favourite, setFavourite] = useState(false);
    const [rideCompleted, setRideCompleted] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const ws = useRef<WebSocket | null>(null);
    const { id } = useContext(IDContext);

    useEffect(() => {
        ws.current = new WebSocket(api.SOCKET + id);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            try {
                const parsed = JSON.parse(e.data);
                if (parsed.review === "1") {
                    setDriverMessage("Ride Completed");
                    setRideCompleted(true);
                } else {
                    setDriverMessage(e.data || "No message provided.");
                    setDriverId(parsed.id);
                    setRideCompleted(false);
                }
            } catch {
                setDriverMessage(e.data);
                setRideCompleted(false);
            }
            setModalVisible(true);
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
    const handleReviewSubmit = () => {
        // object shorthand notation, which is the modern and clean way to build
        // a dictionary when keys and variables have the same name.
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
        console.log(message)
        ws.current?.send(JSON.stringify(message));
        router.replace("/");
    }
    return (
        <View style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.contentContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSource}
                        value={source}
                        placeholder="Enter Source"
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setDestination}
                        value={destination}
                        placeholder="Enter Destination"
                        placeholderTextColor="#888"
                    />
                    <View style={styles.buttonWrapper}>
                        <Button
                            onPress={handleSubmit}
                            title="Submit"
                            color="#22c55e"
                        />
                    </View>

                    <Text style={styles.modalMessage}>{driverMessage}</Text>

                    {rideCompleted && (
                        <View style={styles.reviewSection}>
                            <TextInput
                                style={styles.input}
                                placeholder="Rating (1-5)"
                                value={ride_rating}
                                onChangeText={setRideRating}
                                keyboardType="numeric"
                            />

                            <Text style={styles.ratingTitle}>Rate the following:</Text>
                            <View style={styles.checkboxGroup}>
                                <CheckBox label="Cleanliness" value={review_cleanliness} onChange={setCleanliness} />
                                <CheckBox label="Discipline" value={review_discipline} onChange={setDiscipline} />
                                <CheckBox label="Friendly" value={review_friendly} onChange={setFriendly} />
                                <CheckBox label="Safety" value={review_safety} onChange={setSafety} />
                                <CheckBox label="Arrived on Time" value={review_arrive_on_time} onChange={setOnTime} />
                                <CheckBox label="Favourite Driver?" value={favourite} onChange={setFavourite} />
                            </View>
                            <Button title="Submit Review" color="#22c55e" onPress={handleReviewSubmit} />
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Driver Response</Text>
                    <Text style={styles.modalMessage}>{driverMessage}</Text>
                    <Button
                        title="Close"
                        color="#ef4444"
                        onPress={() => setModalVisible(false)}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#18181b',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        width: '100%',
        maxWidth: 400,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f2937',
        padding: 24,
    },
    modalText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    modalMessage: {
        fontSize: 18,
        color: '#d1d5db',
        marginBottom: 24,
        textAlign: 'center',
    },
    reviewSection: {
        width: '100%',
        marginTop: 20,
    },
    ratingTitle: {
        color: '#fff',
        marginBottom: 8,
    },
    checkboxGroup: {
        marginBottom: 10,
    },
});
