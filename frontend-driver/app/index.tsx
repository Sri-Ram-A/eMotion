import React, { useState, useContext, useEffect } from "react"
import { Text, TextInput, Button, ScrollView, ActivityIndicator, Alert } from "react-native"
import { router } from 'expo-router';
import handleSubmit from '@/services/routes';
import * as types from "@/types"
import { IDContext } from "@/Context"; 



export default function Login() {
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const [formData, setFormData] = useState<types.LoginFormData>({ name: '', email: '', phone_number: '' });
  const { id, setId } = useContext(IDContext); 
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = await handleSubmit(formData, "login/")
      console.info(`[LOGIN] Logged In : ${data}`)
      router.replace("/(tabs)"); // Navigate to the main screen
    } catch (error) {
      Alert.alert("Login Failed", "Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  //If ID exists, redirect to homepage
  useEffect(() => {
    if (id) {
      console.log(`[LOGIN] ID Exists : ${id}`)
      router.replace('/(tabs)');
    }else{
      console.log("[LOGIN] Not Found");
    }
  }, [id]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phone_number}
        onChangeText={(text) => handleChange('phone_number', text)}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={onSubmit} />
      )}

      <Text>Not yet Registered ?</Text>
      <Button title="Click here for registering" onPress={() => router.replace("/register")} />

    </ScrollView>
  )
}