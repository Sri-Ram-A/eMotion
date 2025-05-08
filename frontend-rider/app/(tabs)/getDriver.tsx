import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import * as api from '@/services/api';
import { handleSubmit } from '@/services/routes';
//isrc for websockets :  https://reactnative.dev/docs/network
export default function AboutScreen() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const ws = new WebSocket(api.RIDER_SOCKET);
    ws.onopen = () => { // connection opened
        ws.send(JSON.stringify("Rider connected")); 
    };
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
                onPress={()=>ws.send(String(message))} // onPress={handleSubmit} this is correct if handle didnt have parameters
                title="Submit"
                color="#841584"
            />
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
