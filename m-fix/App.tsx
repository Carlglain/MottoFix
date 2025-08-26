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
import ProfilePage from './screens/user/userProfile';
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
        name="Scan" 
        component={DashboardScan} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="scan-outline" size={20} color={color} />,
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
        component={ProfilePage}
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
          <Stack.Navigator initialRouteName="Onboarding1">
            <Stack.Screen name="Onboarding1" component={Welcome} options={{ headerShown: false }}  />
            <Stack.Screen name="Onboarding2" component={Hero} options={{ headerShown: false }} />
            <Stack.Screen name="status" component={VehicleStatus} />
            <Stack.Screen name="Mechanic" component={ContactMechanic} />
            <Stack.Screen name="Tutorials" component={Tutorials}  />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="FindMechanic" component={FindMechanicsScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ScanDashboard" component={DashboardScan} options={{ headerShown: false }} />
            <Stack.Screen name='SoundScan' component={EngineSound} options={{ headerShown: false }}/>
            <Stack.Screen name='Results' component={DiagnosisResult} />
            <Stack.Screen name='nearbymec' component={FindMechanicsScreen} />
            <Stack.Screen name="EmailVerification" component={VerificationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
