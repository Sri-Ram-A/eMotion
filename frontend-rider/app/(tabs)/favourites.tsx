import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";


const Favourites = () => {
  const { id } = useContext(IDContext);
  const [favourites, setFavourites] = useState<types.FavouriteRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        if (!id) return;
        const data = await handleSubmit(null as unknown as void, 'favourites/', 'GET', id);
        setFavourites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [id]);

  const renderRide = ({ item }: { item: types.FavouriteRide }) => (
    <View style={styles.rideCard}>
      <Text style={styles.rideTitle}>Ride #{item.id}</Text>
      <Text>From: {item.source}</Text>
      <Text>To: {item.destination}</Text>
      <Text>Date: {new Date(item.pickup_time).toLocaleString()}</Text>
      <Text>Duration: {item.estimated_duration} mins</Text>
      <Text>Distance: {item.distance} km</Text>
      <Text>Price: ₹{item.price}</Text>
      <Text>Driver: ⭐ {item.driver}</Text>
      <Text>Rating: ⭐ {item.ride_rating}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (favourites.length === 0) return <Text style={styles.noData}>No favourite rides found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favourite Rides</Text>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Dark theme background
  },
  header: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#FEE140', // Neon yellow accent
    textAlign: 'center',
    marginBottom: 20,
  },
  rideCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FEE140',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#FEE140',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
    fontFamily: 'Poppins-Regular',
  },
  text: {
    color: '#e0e0e0',
    fontFamily: 'Poppins-Regular',
  },
});

export default Favourites;
