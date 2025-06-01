import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Contains most Lucide equivalents

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Globe icon in top right */}
      <Pressable style={styles.globeIcon}>
        <Icon name="earth" size={32} color="white" />
      </Pressable>

      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Welcome back heading */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome back</Text>
        </View>

        {/* Email input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#cbd5e0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Password"
            placeholderTextColor="#cbd5e0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#cbd5e0" 
            />
          </Pressable>
        </View>

        {/* Forgot password link */}
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>

        {/* Log in button */}
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </Pressable>

        {/* Bottom buttons */}
        <View style={styles.bottomButtons}>
          <Pressable style={styles.secondaryButton}>
            <Icon name="google" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Sign in with Google</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a4a3a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  globeIcon: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 384,
    gap: 70,
  },
  header: {
    marginBottom: 48,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 32,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#4a5a4a",
    borderRadius: 16,
    color: "white",
    fontSize: 18,
    paddingLeft: 24,
    paddingRight: 24,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  forgotPassword: {
    alignSelf: "flex-start",
  },
  forgotPasswordText: {
    color: "#cbd5e0",
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#7cb342",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "500",
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#4a5a4a",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});