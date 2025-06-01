import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function SignUpScreen() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!code || !password || !confirm || !role) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Account created!');
    } catch (err) {
      Alert.alert('Signup Failed', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        placeholder="Code"
        placeholderTextColor="#888"
        style={styles.input}
        value={code}
        onChangeText={setCode}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.passwordInput}
          secureTextEntry={secureEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
          <Text style={styles.eyeIcon}>{secureEntry ? '👁' : '🚫'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          style={styles.passwordInput}
          secureTextEntry={secureConfirm}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
          <Text style={styles.eyeIcon}>{secureConfirm ? '👁' : '🚫'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setRole(value)}
          placeholder={{ label: "Car Owner", value: null }}
          items={[
            { label: 'Car Owner', value: 'owner' },
            { label: 'Mechanic', value: 'mechanic' },
          ]}
          style={{
            inputAndroid: styles.pickerInput,
            inputIOS: styles.pickerInput,
            placeholder: { color: '#888' },
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.signupText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.signInLink}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111c10',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1c2b1a',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2b1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    fontSize: 18,
    color: '#aaa',
  },
  pickerContainer: {
    backgroundColor: '#1c2b1a',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  pickerInput: {
    color: '#fff',
    paddingVertical: 14,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#7ce216',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  signupText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    alignSelf: 'center',
    color: '#ccc',
  },
  signInLink: {
    color: '#67c3ff',
    fontWeight: 'bold',
  },
});
