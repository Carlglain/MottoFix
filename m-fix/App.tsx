import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this installed

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', bottom: 0, left: 0, right: 0 },
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
        component={ProfilePage} //will change to the settings page when it's designed
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={20} color={color} />,
        }} 
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding1">
        <Stack.Screen name="Onboarding1" component={Welcome} />
        <Stack.Screen name="Onboarding2" component={Hero} />
        <Stack.Screen name="status" component={VehicleStatus} />
        <Stack.Screen name="ContactMechanic" component={ContactMechanic} />
        <Stack.Screen name="Tutorials" component={Tutorials} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="FindMechanic" component={FindMechanicsScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}