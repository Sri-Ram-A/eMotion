import React, { useState, useContext } from 'react';
import {
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import handleSubmit from '@/services/routes';
import * as types from '@/types';
import { IDContext } from '@/Context';

const RegisterScreen = () => {
  const [formData, setFormData] = useState<types.RegisterFormData>({
    name: '',
    email: '',
    phone_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { id, setId } = useContext(IDContext);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = await handleSubmit(formData, 'register/');
      setResponse(data);
      for (const key in data) {
        await SecureStore.setItemAsync(String(key), String(data[key]));
      }
      if (data.id) {
        setId(data.id);
      }
      console.info(`[REGISTER] Registered : ${data}`);
      setTimeout(() => {
        router.replace('/');
      }, 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#CCCC00"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#CCCC00"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#CCCC00"
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phone_number}
        onChangeText={(text) => handleChange('phone_number', text)}
        style={styles.input}
      />

      <Text style={styles.response}>
        Response received : {JSON.stringify(response, null, 2)}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="small" color="#FFD700" />
      ) : (
        <View style={styles.buttonWrapper}>
          <Button title="Register" onPress={onSubmit} color="#00FF7F" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0D0D0D', // Darker for sleek look
  },
  title: {
    fontSize: 34,
    fontFamily: 'Poppins-Black',
    color: '#00FF7F',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#121212',
    color: '#FDD835',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    borderWidth: 1.5,
    borderColor: '#00FF7F',
    shadowColor: '#00FF7F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  response: {
    color: '#FDD835',
    marginVertical: 18,
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    textAlign: 'center',
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 10,
  },
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
    width: '80%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#00FF7F',
    elevation: 8,
    shadowColor: '#00FF7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
});


export default RegisterScreen;
