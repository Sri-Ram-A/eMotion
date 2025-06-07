import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import handleSubmit from "@/services/routes";
import { IDContext } from "@/Context";
import * as types from "@/types";
import styles from "../../styles/driverprofile"; // 👈 updated import

const Profile = () => {
  const { id, setId } = useContext(IDContext);
  const [profile, setProfile] = useState<types.DriverProfile | null>(null);
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

  const AnimatedField = ({ label, value }: { label: string; value?: string | number }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return value !== undefined ? (
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.animatedField, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.field}>
            <Text style={styles.label}>{label}: </Text>
            {value}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    ) : null;
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!profile) return <Text style={styles.noData}>No profile data available</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Basic Information</Text>
        <AnimatedField label="Name" value={profile.name} />
        <AnimatedField label="Email" value={profile.email} />
        <AnimatedField label="Phone" value={profile.phone_number} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Driver Details</Text>
        <AnimatedField label="License" value={profile.vehicle_plate} />
        <AnimatedField label="Vehicle" value={profile.vehicle_year} />
        <AnimatedField label="Rating" value={profile.rating} />
      </View>
    </View>
  );
};


export default Profile;
