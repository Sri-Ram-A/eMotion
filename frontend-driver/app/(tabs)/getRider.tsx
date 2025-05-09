import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState,useEffect,useRef } from 'react';
import * as api from '@/services/api';
import { handleSubmit } from '@/services/routes';
//isrc for websockets :  https://reactnative.dev/docs/network
export default function AboutScreen() {
    const [riderMessage,setRiderMessage]=useState("Rider message will appear here")
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Initialize WebSocket once,useEffect will avoid reloading whu]ile rerendering
        ws.current = new WebSocket(api.DRIVER_SOCKET);
        ws.current.onopen = () => {
            if(!ws.current) return
            console.log("WebSocket connected");
            ws.current.send(JSON.stringify("Driver connected"));
        };
        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            setRiderMessage(e.data)
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
        <View style={styles.container}>
            <Button
                onPress={()=>ws.current?.send("I am ready")} // onPress={handleSubmit} this is correct if handle didnt have parameters
                title="Come ONLINE"
                color="#841584"
            />
            <Text>{riderMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
