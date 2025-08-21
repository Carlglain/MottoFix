import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import EngineSound from './screens/diagnostics/EngineSound';
import DiagnosisResult from './screens/diagnostics/DiagnosisResult';
import DashboardScan from './screens/diagnostics/DashboardScan';
import VerificationScreen from './screens/auth/emailver';
import SignUpScreen from './screens/auth/Register';
import RequestsScreen from './screens/mechanic/request';
import FindMechanicsScreen from './screens/mechanic/findmechanic';
import SettingsScreen from './screens/user/SettingsScreen';
import Login from './screens/auth/Login';
import Welcome from './screens/welcome/OnboardingScreen1';
import Hero from './screens/welcome/OnboardingScreen2';
import VehicleStatus from './screens/vehicle status/VehicleStutus';
import ContactMechanic from './screens/contact mechanic/ContactMechanic';
import Tutorials from './screens/tutorials/Tutorials';
import Home from './screens/home/Home';
import Test from './screens/diagnostics/test';
import NotificationsScreen from './screens/home/NotificationScreen';
import { AuthProvider } from './services/context/AuthContext';

// ✅ new imports for Settings navigation
import ProfilePage from './screens/user/ProfilePage';
import Payments from './screens/user/Payments';
import Addresses from './screens/user/Addresses';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          backgroundColor:"#333"
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="Tutorial"   // ✅ changed from Scan → Tutorial
        component={Tutorials} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="play-circle-outline" size={20} color={color} />, // ✅ changed icon
        }} 
      />
      <Tab.Screen 
        name="History" 
        component={RequestsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={20} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={20} color={color} />,
        }} 
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding1" screenOptions={{ headerShown: false }}>
            {/* Onboarding */}
            <Stack.Screen name="Onboarding1" component={Welcome} />
            <Stack.Screen name="Onboarding2" component={Hero} />

            {/* Vehicle / Tutorials */}
            <Stack.Screen name="status" component={VehicleStatus} />
            <Stack.Screen name="Mechanic" component={ContactMechanic} />
            <Stack.Screen name="Tutorials" component={Tutorials} />

            {/* Auth */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="EmailVerification" component={VerificationScreen} />

            {/* Main App */}
            <Stack.Screen name="HomeTabs" component={TabNavigator} />
            <Stack.Screen name="ScanDashboard" component={DashboardScan} />
            <Stack.Screen name="SoundScan" component={EngineSound} />
            <Stack.Screen name="Results" component={DiagnosisResult} />
            <Stack.Screen name="nearbymec" component={FindMechanicsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            {/* ✅ Settings inner screens */}
            <Stack.Screen name="ProfilePage" component={ProfilePage} />
            {/* <Stack.Screen name="Payments" component={Payments} />
            <Stack.Screen name="Addresses" component={Addresses} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
