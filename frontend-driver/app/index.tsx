import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import handleSubmit from "@/services/routes";
import * as types from "@/types";
import { IDContext } from "@/Context";

export default function Login() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [formData, setFormData] = useState<types.LoginFormData>({
    name: "",
    email: "",
    phone_number: "",
  });
  const { id, setId } = useContext(IDContext);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = await handleSubmit(formData, "login/");
      console.info(`[LOGIN] Logged In : ${data}`);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    if (id) {
      console.log(`[LOGIN] ID Exists : ${id}`);
      router.replace("/(tabs)");
    } else {
      console.log("[LOGIN] Not Found");
    }
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Login to eMotion Driver</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#FEE140"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#FEE140"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#FEE140"
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phone_number}
        onChangeText={(text) => handleChange("phone_number", text)}
        style={styles.input}
      />

      {isLoading ? (
        <ActivityIndicator size="small" color="#FEE140" style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.linkText}>Not yet Registered?</Text>

      <TouchableOpacity
        onPress={() => router.replace("/register")}
        style={[styles.button, { backgroundColor: "#00FF7F" }]}
      >
        <Text style={[styles.buttonText, { color: "#000" }]}>Click here for registering</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#000",
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    color: "orange",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#FEE140",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FEE140",
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#FEE140",
    marginVertical: 10,
  },
});
