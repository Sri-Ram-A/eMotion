import { Text, View, TextInput, Button } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as api from '@/services/api';
import { IDContext } from '@/Context';
export default function AboutScreen() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [driverMessage, setDriverMessage] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const {id,setId}=useContext(IDContext)

    useEffect(() => {
        ws.current = new WebSocket(api.RIDER_SOCKET+id);
        ws.current.onopen = () => {
            if (!ws.current) return;
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            setDriverMessage(e.data);
        };

        ws.current.onerror = (e: Event) => {
            console.error("WebSocket error:", e);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const handleSubmit = () => {
        const message = {
            source,
            destination,
        };
        ws.current?.send(JSON.stringify(message));
    };

    return (
        <View className="flex-1 bg-zinc-900 justify-center items-center px-4">
            <TextInput
                className="bg-white text-black w-full max-w-md mb-4 px-4 py-2 rounded"
                onChangeText={setSource}
                value={source}
                placeholder="Enter Source"
            />
            <TextInput
                className="bg-white text-black w-full max-w-md mb-4 px-4 py-2 rounded"
                onChangeText={setDestination}
                value={destination}
                placeholder="Enter Destination"
            />
            <View className="mb-6 w-full max-w-md">
                <Button
                    onPress={handleSubmit}
                    title="Submit"
                    color="#22c55e" // Tailwind green-500
                />
            </View>
            <Text className="text-white text-center text-lg">
                Message from driver: {driverMessage}
            </Text>
        </View>
    );
}
