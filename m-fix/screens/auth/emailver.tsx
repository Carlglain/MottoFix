import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const roles = ['Car Owner', 'Mechanic'];

export default function VerificationScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!code || !password || !confirmPassword || !role) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Account created!');
      // Navigate to home or login
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Code"
        placeholderTextColor="#ccc"
        value={code}
        onChangeText={setCode}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Role Picker Dropdown */}
      <TouchableOpacity style={styles.inputRow} onPress={() => {
        const nextRole = role === roles[0] ? roles[1] : roles[0];
        setRole(nextRole);
      }}>
        <Text style={[styles.inputFlex, { color: role ? '#fff' : '#ccc' }]}>
          {role || 'Select Role'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.signUpText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1b0b',
    padding: 20,
  },
  backArrow: {
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2a3924',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  inputRow: {
    backgroundColor: '#2a3924',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputFlex: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#7ce216',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#000',
  },
  footerText: {
    marginTop: 24,
    color: '#999',
    textAlign: 'center',
    fontSize: 13,
  },
  link: {
    color: '#7ce216',
    fontWeight: 'bold',
  },
});
