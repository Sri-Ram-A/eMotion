import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import { MaterialIcons } from "@expo/vector-icons";

const Favourites = () => {
  const { id } = useContext(IDContext);
  const [favourites, setFavourites] = useState<types.FavouriteRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavourites = async () => {
    try {
      if (!id) return;
      setRefreshing(true);
      const data = await handleSubmit(null as unknown as void, 'favourites/', 'GET', id);
      setFavourites(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load favourites");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [id]);

  const renderRide = ({ item }: { item: types.FavouriteRide }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideTitle}>Ride #{item.id}</Text>
        <MaterialIcons name="star" size={24} color="#FFD700" />
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="location-on" size={18} color="#FFD700" />
        <Text style={styles.rideDetailText}>From: {item.source}</Text>
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="location-searching" size={18} color="#FFD700" />
        <Text style={styles.rideDetailText}>To: {item.destination}</Text>
      </View>
      
      <View style={styles.rideDetailRow}>
        <MaterialIcons name="access-time" size={18} color="#FFD700" />
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
        <MaterialIcons name="person" size={18} color="#FFD700" />
        <Text style={styles.driverText}>{item.driver}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.ride_rating}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>Loading your favourites...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color="#FFD700" />
      <Text style={styles.errorText}>Error loading favourites</Text>
      <Text style={styles.errorSubText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchFavourites}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (favourites.length === 0) return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="star-border" size={48} color="#FFD700" />
      <Text style={styles.emptyTitle}>No Favourites Yet</Text>
      <Text style={styles.emptySubtitle}>Your starred rides will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Favourite Rides</Text>
        <TouchableOpacity onPress={fetchFavourites} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={fetchFavourites}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  refreshButton: {
    padding: 8,
  },
  rideCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  rideTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFD700',
  },
  rideDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rideDetailText: {
    color: '#E0E0E0',
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statPill: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  pricePill: {
    backgroundColor: '#3D2C1E',
  },
  statText: {
    color: '#E0E0E0',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  priceText: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  driverText: {
    color: '#E0E0E0',
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFD700',
    fontFamily: 'Poppins-Regular',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginTop: 16,
  },
  errorSubText: {
    color: '#BDBDBD',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#121212',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  emptyTitle: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#BDBDBD',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Favourites;