import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as api from '@/services/api';

export default function AboutScreen() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [driverMessage,setDriverMessage]=useState('');
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Initialize WebSocket once,useEffect will avoid reloading whu]ile rerendering
        ws.current = new WebSocket(api.RIDER_SOCKET);
        ws.current.onopen = () => {
            if(!ws.current) return
            console.log("WebSocket connected");
            ws.current.send(JSON.stringify("Rider connected"));
        };
        ws.current.onmessage = (e) => {
            console.log("Received:", e.data);
            setDriverMessage(e.data)
        };
        ws.current.onerror = (e:Event) => {
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
    const message={
        "source":source,
        "destination":destination
    }
    return (
        <View style={styles.container}>
            <TextInput
                onChangeText={setSource}
                value={source}
                placeholder='Enter Source'
            />
            <TextInput
                onChangeText={setDestination}
                value={destination}
                placeholder='Enter Destination'
            />
            <Button
                onPress={()=>ws.current?.send(String(message))} // onPress={handleSubmit} this is correct if handle didnt have parameters
                title="Submit"
                color="#841584"
            />
            <Text>
                Message from driver : {driverMessage}
            </Text>
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
