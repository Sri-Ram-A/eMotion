import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import * as api from '@/services/api';
import { handleSubmit } from '@/services/routes';
//isrc for websockets :  https://reactnative.dev/docs/network
export default function AboutScreen() {
    const [riderMessage,setRiderMessage]=useState("Rider message will appear here")
    const ws = new WebSocket(api.DRIVER_SOCKET);

    ws.onopen = () => { // connection opened
        ws.send(JSON.stringify("Driver Connected")); 
    };
      
    ws.onmessage = event => {
        console.log(event.data);
        setRiderMessage(event.data)
      };
      
    return (
        <View style={styles.container}>
            <Button
                onPress={()=>handleSubmit(ws)} // onPress={handleSubmit} this is correct if handle didnt have parameters
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
