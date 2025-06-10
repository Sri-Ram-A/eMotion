import React, { useState, useContext, useEffect } from "react"
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native"
import { router } from "expo-router"
import handleSubmit from "@/services/routes"
import * as types from "@/types"
import { IDContext } from "@/Context"

const { width, height } = Dimensions.get("window")

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<types.LoginFormData>({
    name: "",
    email: "",
    phone_number: "",
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { id, setId } = useContext(IDContext)

  const onSubmit = async () => {
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone_number.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    if (formData.phone_number.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number")
      return
    }

    setIsLoading(true)
    try {
      const data = await handleSubmit(formData, "login/")
      console.info(`[LOGIN] Logged In : ${data}`)
      router.replace("/(tabs)") // Navigate to the main screen
    } catch (error) {
      Alert.alert("Login Failed", "Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  // If ID exists, redirect to homepage
  useEffect(() => {
    if (id) {
      console.log(`[LOGIN] ID Exists : ${id}`)
      router.replace("/(tabs)")
    } else {
      console.log("[LOGIN] Not Found")
    }
  }, [id])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section with Logo/Image */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
          </View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Sign in to continue your journey</Text>
        </View>

        {/* Decorative Image/Illustration */}
        <View style={styles.imageContainer}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
              </View>
              <TextInput
                style={[styles.textInput, focusedField === "name" && styles.focusedInput]}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
              </View>
              <TextInput
                style={[styles.textInput, focusedField === "email" && styles.focusedInput]}
                placeholder="Email Address"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
              </View>
              <TextInput
                style={[styles.textInput, focusedField === "phone_number" && styles.focusedInput]}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.phone_number}
                onChangeText={(text) => handleChange("phone_number", text)}
                onFocus={() => setFocusedField("phone_number")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={onSubmit}
              disabled={isLoading}
            >
              
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </>
                )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Section */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.replace("/register")}
              >
                <Text style={styles.registerButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure • Fast • Reliable</Text>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  gradient: {
    flex: 1,
    minHeight: height,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00ff7f",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  decorativeCircle1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 127, 0.1)",
    top: 20,
    left: 50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 255, 127, 0.15)",
    top: 10,
    right: 60,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 255, 127, 0.2)",
    bottom: 30,
    left: width / 2 - 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  formCard: {
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputIconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  focusedInput: {
    borderColor: "#00ff7f",
    borderWidth: 2,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#666",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  registerSection: {
    alignItems: "center",
  },
  registerText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00ff7f",
    backgroundColor: "rgba(0, 255, 127, 0.1)",
  },
  registerButtonText: {
    color: "#00ff7f",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
})