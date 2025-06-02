
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Ionicons name="globe-outline" size={18} color="#fff" style={styles.languageIcon} />

      <Text style={styles.title}>Welcome back</Text>

      <TextInput placeholder="Email" placeholderTextColor="#ccc" style={styles.input} />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.authOptions}>
      <TouchableOpacity style={styles.googleButton}>
  <Image
    source={{
      uri: 'https://www.transparentpng.com/thumb/google-logo/colorful-google-logo-transparent-clipart-download-u3DWLj.png',
    }}
    style={styles.googleLogo}
  />
  <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                style={styles.googleIcon}
              />
  <Text style={styles.googleText}>Sign in with Google</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        Don’t have an account? <Text style={styles.linkText}>Sign Up</Text>
      </Text>
    </View>
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
    fontSize: 200,
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
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default LoginScreen;

