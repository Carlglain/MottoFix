import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const SettingItem = ({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.header}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon={<Ionicons name="person-circle-outline" size={22} color="#fff" />}
          label="Profile"
          onPress={() => navigation.navigate('ProfilePage')}   
        />
        <SettingItem
          icon={<MaterialIcons name="payment" size={22} color="#fff" />}
          label="Payment Methods"
          onPress={() => navigation.navigate('Payments')}
        />
        <SettingItem
          icon={<Ionicons name="location-outline" size={22} color="#fff" />}
          label="Saved Addresses"
          onPress={() => navigation.navigate('Addresses')}
        />

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon={<Ionicons name="notifications-outline" size={22} color="#fff" />}
          label="Notifications"
        />
        <SettingItem
          icon={<Ionicons name="language-outline" size={22} color="#fff" />}
          label="Language"
        />
        <SettingItem
          icon={<Feather name="moon" size={22} color="#fff" />}
          label="Theme"
        />

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon={<Ionicons name="help-circle-outline" size={22} color="#fff" />}
          label="Help Center"
        />
        <SettingItem
          icon={<Ionicons name="chatbubbles-outline" size={22} color="#fff" />}
          label="Contact Us"
        />
        <SettingItem
          icon={<Ionicons name="document-text-outline" size={22} color="#fff" />}
          label="Terms & Conditions"
        />
        <SettingItem
          icon={<Ionicons name="shield-checkmark-outline" size={22} color="#fff" />}
          label="Privacy Policy"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1a0f',
  },
  headerBar: {
    paddingBottom: 16,
    backgroundColor: '#0d1a0f',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaa',
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
});
