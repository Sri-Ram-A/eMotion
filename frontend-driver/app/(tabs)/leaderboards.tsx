import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator,FlatList } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";

const Profile = () => {
  const { id, setId } = useContext(IDContext);
  const [drivers,setDrivers] = useState<types.DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const data = await handleSubmit(null as unknown as void, 'leaderboards/', 'GET');
        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);
  const renderDriver = ({ item }: { item: types.DriverProfile }) => (
    <View style={styles.rideCard}>
      <Text style={styles.rideTitle}>Ride #{item.id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Phone Number: {item.phone_number} km</Text>
      <Text>Rating❤️: {item.rating} </Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (drivers.length === 0) return <Text style={styles.noData}>No Drivers found in leaderboard</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList //HAs inbuilt lazy loading
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDriver}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rideCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Profile;