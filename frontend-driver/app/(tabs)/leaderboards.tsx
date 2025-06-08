import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import styles from "../../styles/leaderboardStyles";

const Profile = () => {
  const { id } = useContext(IDContext);
  const [drivers, setDrivers] = useState<types.DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const data: types.DriverProfile[] = await handleSubmit(null as unknown as void, 'leaderboards/', 'GET');

        // Normalize and calculate custom score
        const maxRating = Math.max(...data.map(d => d.rating || 0), 1);
        const maxRides = Math.max(...data.map(d => d.total_rides || 0), 1);
        const maxEarnings = Math.max(...data.map(d => d.earnings || 0), 1);

        const rankedDrivers = data.map(driver => {
          const normalizedRating = (driver.rating || 0) / maxRating;
          const normalizedRides = (driver.total_rides || 0) / maxRides;
          const normalizedEarnings = (driver.earnings || 0) / maxEarnings;

          const score = (
            0.5 * normalizedRating +
            0.3 * normalizedRides +
            0.2 * normalizedEarnings
          );

          return { ...driver, score };
        });

        rankedDrivers.sort((a, b) => b.score - a.score); // sort descending

        setDrivers(rankedDrivers);
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
      <Text style={styles.info}>Name: <Text style={styles.value}>{item.name}</Text></Text>
      <Text style={styles.info}>Email: <Text style={styles.value}>{item.email}</Text></Text>
      <Text style={styles.info}>Phone Number: <Text style={styles.value}>{item.phone_number}</Text></Text>
      <Text style={styles.info}>Rating⭐: <Text style={styles.rating}>{item.rating}</Text></Text>
      <Text style={styles.info}>Total Rides: <Text style={styles.value}>{item.total_rides}</Text></Text>
      <Text style={styles.info}>Earnings ₹: <Text style={styles.value}>{item.earnings}</Text></Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
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

export default Profile;
