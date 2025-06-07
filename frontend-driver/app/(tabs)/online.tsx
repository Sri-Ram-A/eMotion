import { Text, View, Button, Modal, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
        setRiderMessage(parsed);
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
        <View style={styles.statusCard}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>You are Now Online</Text>
          <Text style={styles.statusSubtext}>Ready to accept ride requests</Text>
        </View>

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
              <Text style={styles.modalTitle}>🚗 Incoming Ride Request</Text>

              {typeof riderMessage === 'object' && (
                <View style={styles.rideDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>👤 Name</Text>
                    <Text style={styles.value}>{riderMessage.name}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>📱 Phone</Text>
                    <Text style={styles.value}>{riderMessage.phone_number}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>📍 From</Text>
                    <Text style={styles.value}>{riderMessage.source_details}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>🎯 To</Text>
                    <Text style={styles.value}>{riderMessage.destination_details}</Text>
                  </View>

                  <View style={styles.priceDistanceRow}>
                    <View style={styles.priceDistanceItem}>
                      <Text style={styles.label}>📏 Distance</Text>
                      <Text style={styles.highlightValue}>{riderMessage.distance}</Text>
                    </View>
                    <View style={styles.priceDistanceItem}>
                      <Text style={styles.label}>💰 Price</Text>
                      <Text style={styles.priceValue}>{riderMessage.price}</Text>
                    </View>
                  </View>
                </View>
              )}
              {typeof riderMessage === 'string' && (
                <Text style={styles.modalText}>{riderMessage}</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAcceptRide}
                >
                  <Text style={styles.acceptButtonText}>Accept Ride</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={handleRejectRide}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
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
            <View style={styles.rideProgressCard}>
              <Text style={styles.rideProgressTitle}>Ride In Progress 🚗💨</Text>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>📍 Map View</Text>
                <Text style={styles.mapSubtext}>Navigation will appear here</Text>
              </View>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => {
                  ws.current?.send(JSON.stringify({ ready: "0" }));
                  setRideInProgress(false);
                  setRiderMessage("Waiting for next... 🕐");
                }}
              >
                <Text style={styles.completeButtonText}>Complete Ride</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1e293b',
    textAlign: 'center',
  },
  rideDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  priceDistanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  priceDistanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '400',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  highlightValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    color: '#059669',
    fontWeight: '700',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rejectButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  rideProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  rideProgressTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 32,
    textAlign: 'center',
  },
  mapPlaceholder: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 48,
    marginBottom: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});