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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // <-- updated import here
import { auth, db } from '../../services/firebase';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Error states for individual fields
  const [errors, setErrors] = useState({});
  // General error message state
  const [generalError, setGeneralError] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.length) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!passwordValidation.hasUpperCase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!passwordValidation.hasLowerCase) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!passwordValidation.hasNumber) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    // Confirm password validation
    if (!confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    // Role validation
    if (!role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({});
    setGeneralError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save user details to Firestore using setDoc and user's UID as document ID
      await setDoc(doc(db, 'users', userId), {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role,
        createdAt: new Date().toISOString(),
      });

      // Success - navigate immediately without alert (alternative approach)
      console.log('Signup successful, navigating to Login...');
      navigation.replace('Login');
      
      // Show success message after navigation
      setTimeout(() => {
        Alert.alert('Success', 'Account created successfully!');
      }, 100);
      
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific Firebase Auth errors
      const newErrors = {};
      let errorMessage = '';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          newErrors.email = 'This email is already registered';
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          break;
          
        case 'auth/invalid-email':
          newErrors.email = 'Invalid email format';
          errorMessage = 'Please enter a valid email address.';
          break;
          
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
          
        case 'auth/weak-password':
          newErrors.password = 'Password is too weak';
          errorMessage = 'Password is too weak. Please choose a stronger password with at least 6 characters.';
          break;
          
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
          
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
          
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
          
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials provided. Please check your information and try again.';
          break;
          
        // Firestore errors
        case 'permission-denied':
          errorMessage = 'Permission denied. Please check your account permissions.';
          break;
          
        case 'unavailable':
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
          
        default:
          // For any other errors, show the error message or a generic message
          errorMessage = err.message || 'An unexpected error occurred. Please try again.';
          console.warn('Unhandled error code:', err.code);
      }
      
      // Set field-specific errors
      setErrors(newErrors);
      
      // Set general error message
      setGeneralError(errorMessage);
      
      // Also show an alert for better visibility
      Alert.alert('Signup Failed', errorMessage, [{ text: 'OK' }]);
      
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation on field blur
  const handleFieldBlur = (field, value) => {
    if (generalError) {
      setGeneralError('');
    }
    
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (!validateName(value)) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          const validation = validatePassword(value);
          if (!validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumber) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
          } else {
            delete newErrors.password;
          }
        }
        if (confirm && value !== confirm) {
          newErrors.confirm = 'Passwords do not match';
        } else if (confirm && value === confirm) {
          delete newErrors.confirm;
        }
        break;
      case 'confirm':
        if (!value) {
          newErrors.confirm = 'Please confirm your password';
        } else if (password !== value) {
          newErrors.confirm = 'Passwords do not match';
        } else {
          delete newErrors.confirm;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      {generalError ? (
        <View style={styles.generalErrorContainer}>
          <Text style={styles.generalErrorText}>{generalError}</Text>
        </View>
      ) : null}

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#888"
        style={[styles.input, errors.name && styles.inputError]}
        value={name}
        onChangeText={setName}
        onBlur={() => handleFieldBlur('name', name)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={[styles.input, errors.email && styles.inputError]}
        value={email}
        onChangeText={setEmail}
        onBlur={() => handleFieldBlur('email', email)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#888"
        style={[styles.input, errors.phone && styles.inputError]}
        value={phone}
        onChangeText={setPhone}
        onBlur={() => handleFieldBlur('phone', phone)}
        keyboardType="phone-pad"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.passwordInput}
          secureTextEntry={secureEntry}
          value={password}
          onChangeText={setPassword}
          onBlur={() => handleFieldBlur('password', password)}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
          <Text style={styles.eyeIcon}>{secureEntry ? '👁' : '🚫'}</Text>
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <View style={[styles.passwordContainer, errors.confirm && styles.inputError]}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          style={styles.passwordInput}
          secureTextEntry={secureConfirm}
          value={confirm}
          onChangeText={setConfirm}
          onBlur={() => handleFieldBlur('confirm', confirm)}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
          <Text style={styles.eyeIcon}>{secureConfirm ? '👁' : '🚫'}</Text>
        </TouchableOpacity>
      </View>
      {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

      <View style={[styles.pickerContainer, errors.role && styles.inputError]}>
        <RNPickerSelect
          onValueChange={(value) => setRole(value)}
          placeholder={{ label: 'Select Role', value: null }}
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
      {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

      <TouchableOpacity
        style={[styles.signupButton, loading && styles.disabledButton]}
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
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
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
  generalErrorContainer: {
    backgroundColor: '#ff444420',
    borderColor: '#ff4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  generalErrorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1c2b1a',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2b1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
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
    marginBottom: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
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
    marginTop: 15,
  },
  disabledButton: {
    opacity: 0.7,
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
