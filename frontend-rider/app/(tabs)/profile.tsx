import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import styles from "@/styles/profile"; 
const Profile = () => {
  const { id, setId } = useContext(IDContext);
  const [profile, setProfile] = useState<types.RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;

        const data = await handleSubmit(null as unknown as void, "profile/", "GET", id);
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
      <Text style={styles.header}>Customer Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Basic Information</Text>
        {renderField("Name", profile.name)}
        {renderField("Email", profile.email)}
        {renderField("Phone", profile.phone_number)}
      </View>
    </View>
  );
};

export default Profile;
