import { Text, View, Button } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';

export default function AboutScreen() {
    const [riderMessage, setRiderMessage] = useState("Waiting for ride requests...");
    const ws = useRef<WebSocket | null>(null);
    const timerRef = useRef<number | NodeJS.Timeout | null>(null);
    const { id , setId} = useContext(IDContext);

    useEffect(() => {
        ws.current = new WebSocket(api.DRIVER_SOCKET + id);
        ws.current.onopen = () => {
            if (!ws.current) return;
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);

            try {
                const parsed = JSON.parse(e.data);

                if (parsed.ride_already_taken == "1") {
                    setRiderMessage("Ride already taken ❌");
                    // Clear immediately
                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(() => {
                        setRiderMessage('');
                    }, 100); // clear quickly after rendering (100ms)
                    return;
                }
            } catch (err) {
                // Not a JSON message — just set as plain string
            }

            setRiderMessage(e.data);
        };

        ws.current.onerror = (e: Event) => {
            console.error("WebSocket error:", e);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (riderMessage && riderMessage !== "Waiting for ride requests...") {
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                setRiderMessage('');
            }, 45000); // 30 seconds for normal messages
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [riderMessage]);

    const handleAcceptRide = () => {
        ws.current?.send(JSON.stringify({ ready: "1" }));
        setRiderMessage("Ride accepted ✅");
    };

    const handleCompleteRide = () => {
        ws.current?.send(JSON.stringify({ ready: "0" }));
        setRiderMessage("Ride completed. Waiting for next... 🕐");
    };

    return (
        <View className="flex-1 bg-gray-900 justify-center items-center p-4">
            <View className="mb-4 w-full">
                <Button
                    onPress={handleAcceptRide}
                    title="Accept Ride"
                    color="#10b981"
                />
            </View>
            <View className="mb-8 w-full">
                <Button
                    onPress={handleCompleteRide}
                    title="Reject Ride"
                    color="#ef4444"
                />
            </View>
            {riderMessage ? (
                <Text className="text-white text-lg text-center">
                    {riderMessage}
                </Text>
            ) : null}
        </View>
    );
}
