import { Text, View, Button, Modal, Alert, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
import * as types from "@/types"

export default function AboutScreen() {
  const [riderMessage, setRiderMessage] = useState<types.RiderData | string>("Waiting for ride requests...");
  const ws = useRef<WebSocket | null>(null);
  const { id } = useContext(IDContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [rideInProgress, setRideInProgress] = useState(false);

  const connectWebSocket = () => {
    ws.current = new WebSocket(api.SOCKET + id);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (e) => {
      console.log("Received:", e.data);

      try {
        const parsed = JSON.parse(e.data);
        if (parsed.ride_already_taken === "1") {
          setRiderMessage('');
          setModalVisible(false);
          return;
        }
        setRiderMessage(parsed.message || e.data);
        setModalVisible(true);
      } catch (err) {
        console.log("Non-JSON or parse error:", err);
        setRiderMessage(e.data);
        setModalVisible(true);
      }
    };

    ws.current.onerror = (e: Event) => {
      console.error("WebSocket error:", e);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, []);


  const handleAcceptRide = () => {
    ws.current?.send(JSON.stringify({ ready: "1" }));
    setRiderMessage("Ride accepted ✅");
    setModalVisible(false);
    setRideInProgress(true);
  };

  const handleRejectRide = () => {
    setRiderMessage("Waiting for next... 🕐");
    setModalVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        <Text style={styles.statusText}>You are Now Online</Text>

        {/* Modal for ride request */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Ride rejected!');
            setModalVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Incoming Ride Request</Text>

              {typeof riderMessage === 'object' && (
                <>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{riderMessage.name}</Text>

                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{riderMessage.phone_number}</Text>

                  <Text style={styles.label}>Source:</Text>
                  <Text style={styles.value}>{riderMessage.source_details}</Text>

                  <Text style={styles.label}>Destination:</Text>
                  <Text style={styles.value}>{riderMessage.destination_details}</Text>
                </>
              )}
              {typeof riderMessage === 'string' && (
                <Text style={styles.modalText}>{riderMessage}</Text>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  onPress={handleAcceptRide}
                  title="Accept Ride"
                  color="#10b981" // Emerald green
                />
                <View style={{ height: 10 }} />
                <Button
                  onPress={handleRejectRide}
                  title="Reject Ride"
                  color="#ef4444" // Rose red
                />
              </View>
            </View>
          </View>

        </Modal>

        {/* Modal for ride in progress */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={rideInProgress}
          onRequestClose={() => {
            Alert.alert('Are you sure you want to cancel the ride?');
            setRideInProgress(false);
          }}
        >
          <View style={styles.fullscreenContainer}>
            <Text style={styles.statusText}>Ride In Progress 🚗💨</Text>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#fff' }}>Display map or image here 📍</Text>
            </View>
            <Button
              title="Complete Ride"
              color="#10b981"
              onPress={() => {
                ws.current?.send(JSON.stringify({ ready: "0" }));
                setRideInProgress(false);
                setRiderMessage("Waiting for next... 🕐");
              }}
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  statusText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dim black backdrop
  },
  modalView: {
    backgroundColor: '#ffffff', // White modal
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

