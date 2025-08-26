import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '835060401854-46tgqfqd32nb0o2a84qeah506c5etce5.apps.googleusercontent.com',
    iosClientId: '<your_ios_client_id_if_any>',
    webClientId: '835060401854-ca5im2jb727b2ub202rtlhee6q7rq6tk.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  console.log('Redirect URI:', AuthSession.makeRedirectUri({ useProxy: true }));

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'Logged in with Google!');
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error('Firebase Google login error:', error);
          Alert.alert('Login Failed', error.message);
        });
    } else if (response?.type === 'error') {
      console.error('Google sign-in error:', response.error);
      Alert.alert('Google Sign-In Failed', response.error.message || 'An unknown error occurred.');
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Missing Fields', 'Please enter both email and password.');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in successfully.');
      navigation.navigate('HomeTabs');
    } catch (error) {
      console.error('Email login error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="globe-outline" size={18} color="#fff" style={styles.languageIcon} />

      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.authOptions}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            if (request) {
              promptAsync();
            } else {
              Alert.alert('Error', 'Google sign-in not available.');
            }
          }}
        >
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        Don’t have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  languageIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#2e3a1f',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e3a1f',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 14,
  },
  forgotText: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#8bc34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e3a1f',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  googleLogo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#2e3a1f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomText: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 25,
  },
  linkText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
