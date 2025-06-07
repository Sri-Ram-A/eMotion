import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { IDContext } from '@/Context';
import handleSubmit from '@/services/routes';
import * as types from '@/types';
import styles from '../../styles/indexStyles'; // ✅ Correct path to external styles

const { width } = Dimensions.get('window');

const driverFeatures = [
  {
    image: require('../../assets/images/demand.png'),
    title: 'Track High-Demand Areas',
    description:
      'Stay updated on hotspots to increase your chances of getting ride requests.',
  },
  {
    image: require('../../assets/images/profit.png'),
    title: 'Maximize Your Earnings',
    description:
      'Drive smartly by planning routes where demand and fares are highest.',
  },
  {
    image: require('../../assets/images/leaderboard.webp'),
    title: 'Compete & Climb the Leaderboard',
    description:
      'Top performers get recognized — see where you stand among other drivers.',
  },
];

export default function DriverHome() {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useContext(IDContext);
  const [profile, setProfile] = useState<types.DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [slideAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= driverFeatures.length) nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const data = await handleSubmit(null as unknown as void, 'profile/', 'GET', id);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const renderItem = ({ item }: { item: typeof driverFeatures[0] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FEE140" />
      ) : (
        <Animated.Text style={[styles.heading, { transform: [{ translateY: slideAnim }] }]}>
          {profile ? `Welcome, ${profile.name}! 🚗💨` : 'Welcome, Driver! 🚗💨'}
        </Animated.Text>
      )}

      <FlatList
        ref={flatListRef}
        data={driverFeatures}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />

      <View style={styles.buttonsContainer}>
        <Link href="./leaderboards" asChild>
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Check Leaderboard</Text>
          </TouchableOpacity>
        </Link>

        <Link href="./demand" asChild>
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>High-Demand Areas</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
