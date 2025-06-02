import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

// Simulated API call (replace later)
const fetchMechanicsMapData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mapImage: 'https://i.imgur.com/3mP2hGK.png', // Replace with real map or static
      });
    }, 1000);
  });
};

export default function FindMechanicsScreen() {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadMap = async () => {
      try {
        const data = await fetchMechanicsMapData();
        setMapData(data);
      } catch (err) {
        setError('Could not load map data.');
        Alert.alert('Error', 'Failed to fetch map data.');
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7ce216" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Find Mechanics</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for mechanics"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {/* Map Image */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: mapData.mapImage }}
          style={styles.mapImage}
          resizeMode="contain"
        />

        {/* Zoom Buttons (non-functional yet) */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111c10',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#1c2b1a',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    top: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: '#2a3823',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 5,
  },
  zoomText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a2716',
    borderTopWidth: 1,
    borderTopColor: '#2f3a29',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  navText: {
    color: '#9a9a9a',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111c10',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
