import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" asChild>
          <Text style={styles.linkText}>Go back to Home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Full black background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  linkText: {
    fontSize: 22,
    color: '#FEE140', // Bright golden yellow
    fontFamily: 'Poppins-Bold', // Ensure this font is loaded
    textAlign: 'center',
    textDecorationLine: 'underline',
    textShadowColor: '#FEE140',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
