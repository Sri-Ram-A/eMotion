import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";

const Profile = () => {
  const { id,setId } = useContext(IDContext);
  const [profile, setProfile] = useState<types.DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        
        const data = await handleSubmit(null as unknown as void, 'profile/', 'GET', id);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const renderField = (label: string, value?: string | number) => 
    value !== undefined ? (
      <Text style={styles.field}>
        <Text style={styles.label}>{label}: </Text>
        {value}
      </Text>
    ) : null;

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!profile) return <Text style={styles.noData}>No profile data available</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver Profile</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Basic Information</Text>
        {renderField("Name", profile.name)}
        {renderField("Email", profile.email)}
        {renderField("Phone", profile.phone_number)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Driver Details</Text>
        {renderField("License", profile.vehicle_plate)}
        {renderField("Vehicle", profile.vehicle_year)}
        {renderField("Rating", profile.rating)}
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  field: {
    marginBottom: 5,
  fontSize: 16,
  },
  label: {
    fontWeight: '500',
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