import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import VehicleSelectionPopup from './VehicleSelectionPopup'; 

// Simulated API fetch function
const fetchVehicleStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        engine: "Normal",
        tires: "Good",
        battery: "Charged",
      });
    }, 1000);
  });
};

const fetchLatestDiagnosis = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        car: "2021 Honda Civic",
        check: "Engine Check",
        note: "No issues detected",
        image: "https://autoprotoway.com/wp-content/uploads/2023/02/car-dashboard-symbols.jpg",
      });
    }, 1000);
  });
};

export default function Home({ navigation }) {
  const [status, setStatus] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [popupActionType, setPopupActionType] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statusData, diagnosisData] = await Promise.all([
          fetchVehicleStatus(),
          fetchLatestDiagnosis(),
        ]);
        setStatus(statusData);
        setDiagnosis(diagnosisData);
      } catch (err) {
        setError("Failed to load data");
        Alert.alert("Error", "Could not fetch vehicle data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleScanPress = () => {
    setPopupActionType('scan');
    setShowVehiclePopup(true);
  };

  const handleRecordPress = () => {
    setPopupActionType('record');
    setShowVehiclePopup(true);
  };

  const handleVehicleSelect = (selectedVehicle, actionType) => {
    setShowVehiclePopup(false);

    if (actionType === 'scan') {
      navigation.navigate('ScanDashboard', { vehicle: selectedVehicle });
    } else {
      navigation.navigate('SoundScan', { vehicle: selectedVehicle });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#7ce216" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.header}>MFix</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <TouchableOpacity style={styles.statusBox} onPress={handleScanPress}>
            <Text style={styles.statusValue}>Tap to scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusBox} onPress={handleRecordPress}>
            <Text style={styles.statusValue}>Tap to record</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.diagnosticButton}>
          <Text style={styles.diagnosticButtonText}>Start Diagnostic</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Shortcuts</Text>
        <View style={styles.shortcutsGrid}>
          {["Recent Results", "Reminders", "Tutorials", "Sell Car"].map((item, idx) => (
            <View key={idx} style={styles.shortcutBox}>
              <Text style={styles.shortcutText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Latest Diagnosis</Text>
        <View style={styles.latestDiagnosisBox}>
          <View>
            <Text style={styles.carText}>{diagnosis.car}</Text>
            <Text style={styles.checkText}>{diagnosis.check}</Text>
            <Text style={styles.noteText}>{diagnosis.note}</Text>
          </View>
          <Image
            source={{ uri: diagnosis.image }}
            style={styles.engineImage}
          />
        </View>

        <VehicleSelectionPopup
          visible={showVehiclePopup}
          onClose={() => setShowVehiclePopup(false)}
          onVehicleSelect={handleVehicleSelect}
          actionType={popupActionType}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111c10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 50,
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statusBox: {
    backgroundColor: '#4a5a3e',
    paddingVertical: 50,
    borderRadius: 8,
    width: '48%',
    paddingHorizontal: 40,
  },
  statusValue: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  diagnosticButton: {
    backgroundColor: '#7ce216',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  diagnosticButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shortcutBox: {
    width: '48%',
    backgroundColor: '#313d2a',
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shortcutText: {
    color: '#fff',
  },
  latestDiagnosisBox: {
    backgroundColor: '#1f2b1a',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carText: {
    color: '#ccc',
    fontSize: 13,
  },
  checkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  noteText: {
    color: '#a9a9a9',
    fontSize: 13,
  },
  engineImage: {
    width: 60,
    height: 60,
    marginLeft: 10,
    resizeMode: 'contain',
  },
});
