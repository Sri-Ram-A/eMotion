import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { IDContext } from '@/Context';
import * as types from '@/types';
import handleSubmit from '@/services/routes';
import styles from '@/styles/indexStyles'; // ✅ Import styles

const { width } = Dimensions.get('window');

const features = [
  {
    image: require('../assets/images/driver.jpg'),
    title: 'Seamless Driver Matchmaking',
    description: 'Find the best drivers instantly based on your location and preferences.',
  },
  {
    image: require('../assets/images/split.jpg'),
    title: 'Split Rides Efficiently',
    description: 'Share your ride and save more, while reducing your carbon footprint.',
  },
  {
    image: require('../assets/images/savetime.jpg'),
    title: 'Save Time & Avoid Traffic',
    description: 'Get matched with optimal routes and smart drivers to reduce commute time and bypass traffic congestion effortlessly.',
  },
];

export default function Index() {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { id } = useContext(IDContext);
  const [profile, setProfile] = useState<types.RiderProfile | null>(null);

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
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % features.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const data = await handleSubmit(null as unknown as void, 'profile/', 'GET', id);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  const renderItem = ({ item }: { item: typeof features[0] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.heading, { transform: [{ translateY: slideAnim }] }]}>
        {profile?.name ? `Welcome, ${profile.name}! 🚀` : 'Welcome to eMotion 🚀'}
      </Animated.Text>

      <FlatList
        ref={flatListRef}
        data={features}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />

      <View style={styles.buttonsContainer}>
        <Link href="./getDriver" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Normal Ride</Text>
          </TouchableOpacity>
        </Link>

        <Link href="./getSplitDriver" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Split Ride</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
