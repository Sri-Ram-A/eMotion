import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#1e3a8a', // Tailwind blue-800
                tabBarInactiveTintColor: '#6b7280', // Tailwind gray-500

                // 🔧 Updated top header bar to dark grey/black
                headerStyle: {
                    backgroundColor: '#1f2937', // Tailwind gray-800
                },
                headerTitleStyle: {
                    color: 'yellow', // Tailwind yellow-400
                    fontWeight: 'bold',
                    textAlign:'center'
                },
                headerTintColor: '#facc15', // Icons and back arrow in yellow

                // ✅ Keep tab bar white
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e5e7eb', // Tailwind gray-200
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="leaderboards"
                options={{
                    title: 'Leaderboard',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'trophy' : 'trophy-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="demand"
                options={{
                    title: 'Demand',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'bar-chart' : 'bar-chart-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
