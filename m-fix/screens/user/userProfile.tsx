import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavBar from '../home/navbar';

const ProfilePage = ({ navigation }) => {
  // State for user data - ready for backend integration
  const [userData, setUserData] = useState({
    name: 'Alex Turner',
    role: 'Mechanic',
    avatar: null, // Will be replaced with actual image URL from backend
    location: '825 Main Street, Anytown',
    specialization: 'Engine Diagnostics, Brake Repair',
    certifications: 'ASE Certified',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);

  // API service functions - ready for backend integration
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/user/profile`, {
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // setUserData(data);
      
      // Mock delay to simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const updateAvailability = async (isAvailable) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/user/availability`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isAvailable }),
      // });
      
      // Update local state
      setUserData(prev => ({ ...prev, isAvailable }));
      
      // Show success message
      Alert.alert(
        'Success', 
        `You are now ${isAvailable ? 'available' : 'unavailable'} for work`
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability');
      // Revert the switch if API call fails
      setUserData(prev => ({ ...prev, isAvailable: !isAvailable }));
    }
  };

  const editProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate('EditProfile', { userData });
  };

  const viewStoreDetails = () => {
    // Navigate to store details screen
    navigation.navigate('StoreDetails');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const ProfileItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color="#666" />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2D4A3E" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={editProfile}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={40} color="#666" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userRole}>{userData.role}</Text>
        </View>

        {/* Store Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Details</Text>
          
          <ProfileItem
            icon="location-on"
            title="Location"
            subtitle={userData.location}
            onPress={viewStoreDetails}
          />
          
          <ProfileItem
            icon="build"
            title="Specialization"
            subtitle={userData.specialization}
            onPress={viewStoreDetails}
          />
          
          <ProfileItem
            icon="verified"
            title="Certifications"
            subtitle={userData.certifications}
            onPress={viewStoreDetails}
          />
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          
          <ProfileItem
            icon="access-time"
            title="Available"
            rightComponent={
              <Switch
                value={userData.isAvailable}
                onValueChange={updateAvailability}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={userData.isAvailable ? '#fff' : '#fff'}
                ios_backgroundColor="#E0E0E0"
              />
            }
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="qr-code-scanner" size={24} color="#666" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="history" size={24} color="#666" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        
       
      </View>
       {/* <BottomNavBar/> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D4A3E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2D4A3E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#2D4A3E',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#B0BDB5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: '#B0BDB5',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
  },
});

export default ProfilePage;