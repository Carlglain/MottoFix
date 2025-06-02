import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DashboardScan from './screens/diagnostics/DashboardScan';
import DashboardScreen from './screens/Car/status';
import VerificationScreen from './screens/auth/emailver';
import SignUpScreen from './screens/auth/Register';
import RequestsScreen from './screens/mechanic/request';
import FindMechanicsScreen from './screens/mechanic/findmechanic';
import ProfilePage from './screens/user/userProfile';
import Login from './screens/auth/Login';
import Welcome from './screens/welcome/OnboardingScreen1'
import Hero from './screens/welcome/OnboardingScreen2'
import VehicleStatus from './screens/vehicle status/VehicleStutus';
import ContactMechanic from './screens/contact mechanic/ContactMechanic';
import Tutorials from './screens/tutorials/Tutorials';
export default function App() {
  return (
    <View style={styles.background} >
      {/* <Welcome /> */}
      {/* <Hero /> */}
    {/* <Login /> */}
    {/* <VehicleStatus /> */}
    {/* <ContactMechanic /> */}
    {/* <Tutorials /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1C240F',
    justifyContent: 'center',
    marginTop:10,
    paddingTop:2
  }})
