import { Stack } from 'expo-router';
import React from 'react';
import { IDProvider } from '@/Context';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  // Ensure the Poppins font is loaded
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FEE140" />
      </View>
    );
  }

  return (
    <IDProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#FEE140',
            fontSize: 22,
            fontFamily: 'Poppins-Bold',
          },
          headerTintColor: '#FEE140', // For back button
          contentStyle: { backgroundColor: '#000' }, // screen background
        }}
      >
        <Stack.Screen
          name="register"
          options={{
            title: 'Register',
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Oops! Not Found',
          }}
        />
      </Stack>
    </IDProvider>
  );
}
