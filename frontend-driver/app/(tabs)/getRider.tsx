import { Text, View, StyleSheet, Button } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
// isrc for websockets: https://reactnative.dev/docs/network

export default function AboutScreen() {
    const [riderMessage, setRiderMessage] = useState("Waiting for ride requests...");
    const ws = useRef<WebSocket | null>(null);
    const {id,setId}=useContext(IDContext)

    useEffect(() => {
        // Initialize WebSocket once, useEffect will avoid reloading while rerendering
        ws.current = new WebSocket(api.DRIVER_SOCKET+id);
        ws.current.onopen = () => {
            if (!ws.current) return;
            console.log("WebSocket connected");
            
        };
        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            setRiderMessage(e.data);
        };

        ws.current.onerror = (e: Event) => {
            console.error("WebSocket error:", e);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };
        
        // Cleanup WebSocket on unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);
      
    return (
        <View className="flex-1 bg-gray-900 justify-center items-center p-4">
            <View className="mb-8">
                <Button
                    onPress={() => ws.current?.send(JSON.stringify({ready:"1"}))}
                    title="Accept RIde"
                    color="#8b5cf6" // purple-500
                />
            </View>
            <Text className="text-white text-lg text-center">
                {riderMessage}
            </Text>
        </View>
    );
}