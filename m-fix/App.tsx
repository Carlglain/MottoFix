import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './screens/auth/Login';
import BottomNavigation from './navigation/BottomNavigation';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Your actual screen */}
      <LoginScreen />

      {/* Bottom nav on top of everything */}
      <BottomNavigation />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Important: makes this View take full screen height
    position: 'relative', // Ensures BottomNavigation can be absolutely positioned inside
  },
});
