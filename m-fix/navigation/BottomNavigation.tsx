import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Home,
  Camera,
  History,
  Settings,
  LucideProps,
} from 'lucide-react-native';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: Camera },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNavigation() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TouchableOpacity style={styles.navigationBar}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveItem(item.id)}
              style={[
                styles.navigationBarItem,
                isActive && styles.activeNavigationBarItem,
              ]}
            >
              <Icon
                size={24}
                color={isActive ? '#fff' : '#ccc'}
                strokeWidth={2}
              />
              <Text style={styles.navigationBarItemLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    zIndex: 9999,
    elevation: 10,
    width: Dimensions.get('window').width,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  navigationBarItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeNavigationBarItem: {
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  navigationBarItemLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
});
