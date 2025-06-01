import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/auth/Login';
import DashboardScan from './screens/diagnostics/DashboardScan';
import DashboardScreen from './screens/Car/status';
import VerificationScreen from './screens/auth/emailver';
import SignUpScreen from './screens/auth/Register';
import RequestsScreen from './screens/mechanic/request';
import FindMechanicsScreen from './screens/mechanic/findmechanic';
import ProfilePage from './screens/user/userProfile';
export default function App() {
  return (
    <View>
    <ProfilePage />
    </View>
  );
};
