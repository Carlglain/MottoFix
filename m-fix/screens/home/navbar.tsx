import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // If not using Expo, use react-native-vector-icons/Ionicons

const tabs = [
  { name: 'Home', icon: 'home-outline' },
  { name: 'Scan', icon: 'scan-outline' },
  { name: 'History', icon: 'time-outline' },
  { name: 'Settings', icon: 'settings-outline' },
];

export default function BottomNavBar({navigation}) {
  return (
    <View style={styles.navBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity   onPress={() => navigation.navigate(tab.name)}  key={index} style={styles.tab}>
          <Ionicons name ={tab.icon} size={20} color="#9a9a9a" />
          <Text style={styles.tabText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    right: 0,
    backgroundColor: '#1a2716',
    borderTopWidth: 1,
    borderTopColor: '#2f3a29',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    // width:400,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#9a9a9a',
    marginTop: 4,
  },
});
