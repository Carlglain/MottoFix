// components/ProtectedRoute.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../services/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    navigation.navigate('Login');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
