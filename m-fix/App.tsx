import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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