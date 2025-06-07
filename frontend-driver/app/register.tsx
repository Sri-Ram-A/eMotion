import React, { useState, useContext } from 'react';
import {
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store";

import handleSubmit from '@/services/routes';
import * as types from "@/types";
import { IDContext } from "@/Context";

const RegisterScreen = () => {
  const [formData, setFormData] = useState<types.RegisterFormData>({
    name: '',
    email: '',
    phone_number: '',
    vehicle_year: '',
    vehicle_plate: '',
    driving_license: ''
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
      setTimeout(() => { router.replace('/') }, 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
        Register 🚗
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.subtitle}>
        Create your account
      </Animated.Text>

      {[
        { placeholder: 'Name', key: 'name', keyboard: 'default' },
        { placeholder: 'Email', key: 'email', keyboard: 'email-address' },
        { placeholder: 'Phone Number', key: 'phone_number', keyboard: 'phone-pad', maxLength: 10 },
        { placeholder: 'Vehicle Year', key: 'vehicle_year', keyboard: 'number-pad', maxLength: 4 },
        { placeholder: 'Vehicle Plate', key: 'vehicle_plate', keyboard: 'default' },
        { placeholder: 'Driving License', key: 'driving_license', keyboard: 'default' },
      ].map((field, idx) => (
        <Animated.View
          key={field.key}
          entering={FadeInDown.delay(200 + idx * 100).duration(500)}
          style={{ width: '100%' }}
        >
          <TextInput
            placeholder={field.placeholder}
            placeholderTextColor="#666"
            keyboardType={field.keyboard as any}
            maxLength={field.maxLength}
            style={styles.input}
            value={formData[field.key as keyof typeof formData]}
            onChangeText={(text) => handleChange(field.key as keyof typeof formData, text)}
          />
        </Animated.View>
      ))}

      <Text style={styles.response}>
        Response received : {JSON.stringify(response, null, 2)}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Black',
    color: '#facc15',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#22c55e',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: '#facc15',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    fontFamily: 'Poppins-Light',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  response: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'left',
    marginVertical: 8,
    width: '100%',
    fontFamily: 'Poppins-Regular',
  },
});
