import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const VehicleStatus = () => {
  return (
    <ScrollView style={styles.container}>
    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', }}>
      <Text style={styles.header}>MFix</Text>
    <TouchableOpacity><Ionicons name="notifications" size={24} color="white" /></TouchableOpacity>
    </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Vehicle Status</Text>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', }}>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Engine</Text>
          <Text style={styles.statusValue}>Normal</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Tires</Text>
          <Text style={styles.statusValue}>Good</Text>
        </View>
        </View>
        <View style={styles.statusBox1}>
          <Text style={styles.statusText}>Battery</Text>
          <Text style={styles.statusValue}>Charged</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Diagnostic</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.shortcutLabel}>Shortcuts</Text>
      <View style={styles.shortcutsContainer}>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Recent Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Tutorials</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Sell Car</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.diagnosisLabel}>Latest Diagnosis</Text>
      <View style={styles.diagnosisContainer}>
        <View>
            <Text style={styles.diagnosisText}>2021 Honda Civic</Text>
            <Text style={styles.diagnosisDetail}>Engine Check</Text>
            <Text style={styles.diagnosisDetail}>No issues detected</Text>
        </View>
        <Image 
        source={require('../../assets/engine.png')}
        style ={{width:100,borderRadius:2,height:50}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  statusBox: {
    backgroundColor: '#3A3A3A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width:150
  },
  statusBox1: {
    backgroundColor: '#3A3A3A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    color: '#AAAAAA',
  },
  statusValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shortcutLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shortcutBox: {
    backgroundColor: '#3A3A3A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  shortcutText: {
    color: '#FFFFFF',
  },
  diagnosisLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  diagnosisContainer: {
    backgroundColor: '#3A3A3A',
    padding: 15,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    borderRadius: 10,
  },
  diagnosisText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  diagnosisDetail: {
    color: '#AAAAAA',
  },
});

export default VehicleStatus;