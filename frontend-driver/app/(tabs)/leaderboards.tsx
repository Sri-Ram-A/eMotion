import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginVertical: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  error: {
    color: '#FF3333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#CCCCCC',
    marginVertical: 4,
    lineHeight: 20,
  },
  value: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  rating: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

const leaderboard = () => {
  const { id } = useContext(IDContext);
  const [drivers, setDrivers] = useState<types.DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const data: types.DriverProfile[] = await handleSubmit(null as unknown as void, 'leaderboards/', 'GET');
        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const renderDriver = ({ item }: { item: types.DriverProfile }) => (
    <View style={styles.rideCard}>
      <Text style={styles.rideTitle}>Rank #{item.id}</Text>
      <Text style={styles.info}>Name: <Text style={styles.value}>{item.name}</Text></Text>
      <Text style={styles.info}>Email: <Text style={styles.value}>{item.email}</Text></Text>
      <Text style={styles.info}>Phone Number: <Text style={styles.value}>{item.phone_number}</Text></Text>
      <Text style={styles.info}>Rating⭐: <Text style={styles.rating}>{item.rating}</Text></Text>
      <Text style={styles.info}>Total Rides: <Text style={styles.value}>{item.total_rides}</Text></Text>
      <Text style={styles.info}>Earnings ₹: <Text style={styles.value}>{item.earnings}</Text></Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (drivers.length === 0) return <Text style={styles.noData}>No Drivers found in leaderboard</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDriver}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default leaderboard;