import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import styles from "@/styles/historyStyles";


const Favourites = () => {
  const { id } = useContext(IDContext);
  const [history, setHistory] = useState<types.FavouriteRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!id) return;
        const data = await handleSubmit(null as unknown as void, 'history/', 'GET', id);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
  if (history.length === 0) return <Text style={styles.noData}>No favourite rides found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Ride History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Favourites;
