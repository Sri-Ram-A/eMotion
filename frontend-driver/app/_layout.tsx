import { Stack } from 'expo-router';
import React from 'react';
import { IDProvider } from '@/Context';

export default function RootLayout() {
  return (
    <IDProvider>
      <Stack>
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            title: 'register'
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: 'login'
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </IDProvider>
  );
}