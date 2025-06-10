import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import styles from "@/styles/historyStyles";

const History = () => {
  const { id } = useContext(IDContext);
  const [history, setHistory] = useState<types.FavouriteRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      if (!id) return;
      setRefreshing(true);
      const data = await handleSubmit(null as unknown as void, 'history/', 'GET', id);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const renderRide = ({ item }: { item: types.FavouriteRide }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideTitle}>Ride #{item.id}</Text>
        <MaterialIcons name="history" size={24} color="#4CAF50" />
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="location-on" size={18} color="#4CAF50" />
        <Text style={styles.rideDetailText}>From: {item.source}</Text>
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="location-searching" size={18} color="#4CAF50" />
        <Text style={styles.rideDetailText}>To: {item.destination}</Text>
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="access-time" size={18} color="#4CAF50" />
        <Text style={styles.rideDetailText}>{new Date(item.pickup_time).toLocaleString()}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statPill}>
          <Text style={styles.statText}>⏱️ {item.estimated_duration} mins</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statText}>📏 {item.distance} km</Text>
        </View>
        <View style={[styles.statPill, styles.pricePill]}>
          <Text style={[styles.statText, styles.priceText]}>₹{item.price}</Text>
        </View>
      </View>
      
      <View style={styles.driverContainer}>
        <MaterialIcons name="person" size={18} color="#4CAF50" />
        <Text style={styles.driverText}>{item.driver}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#4CAF50" />
          <Text style={styles.ratingText}>{item.ride_rating}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.loadingText}>Loading your history...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color="#4CAF50" />
      <Text style={styles.errorText}>Error loading history</Text>
      <Text style={styles.errorSubText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (history.length === 0) return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="history" size={48} color="#4CAF50" />
      <Text style={styles.emptyTitle}>No Ride History</Text>
      <Text style={styles.emptySubtitle}>Your completed rides will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Ride History</Text>
        <TouchableOpacity onPress={fetchHistory} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={fetchHistory}
      />
    </View>
  );
};

export default History;