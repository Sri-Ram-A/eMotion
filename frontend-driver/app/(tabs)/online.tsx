import { Text, View, Button, Modal, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
import * as types from "@/types"
import styles from "../../styles/onlineStyle"; // 👈 updated import
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
                    {(riderMessage.arrive_at) &&
                    (<View style={styles.priceDistanceItem}>
                      <Text style={styles.label}>📏 Arrive AT</Text>
                      <Text style={styles.highlightValue}>{riderMessage.arrive_at}</Text>
                    </View>)}
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