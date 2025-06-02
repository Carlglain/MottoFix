import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import BottomNavBar from '../home/navbar';
//import BottomNavBar from '../../components/BottomNavBar'; // Adjust path as needed

// Simulate API fetch (to replace later)
const fetchRequests = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        newRequests: [
          {
            id: 1,
            title: 'Engine fault',
            vehicle: '2018 Honda Civic',
            image: 'https://img.icons8.com/ios-filled/100/engine.png',
          },
          {
            id: 2,
            title: 'Brake issue',
            vehicle: '2019 Toyota Camry',
            image: 'https://img.icons8.com/ios-filled/100/brake-discs.png',
          },
          {
            id: 3,
            title: 'Transmission problem',
            vehicle: '2020 Ford F-150',
            image: 'https://img.icons8.com/ios-filled/100/gearbox.png',
          },
        ],
        acceptedRequests: [
          {
            id: 4,
            title: 'Electrical malfunction',
            vehicle: '2019 Chevrolet Silverado',
            image: 'https://img.icons8.com/ios-filled/100/electricity.png',
          },
          {
            id: 5,
            title: 'Suspension issue',
            vehicle: '2017 Nissan Altima',
            image: 'https://img.icons8.com/ios-filled/100/suspension.png',
          },
        ],
      });
    }, 1200);
  });
};

const RequestItem = ({ item }) => (
  <TouchableOpacity style={styles.requestItem}>
    <Image source={{ uri: item.image }} style={styles.requestImage} />
    <View>
      <Text style={styles.requestTitle}>{item.title}</Text>
      <Text style={styles.requestSubtitle}>{item.vehicle}</Text>
    </View>
  </TouchableOpacity>
);

export default function RequestsScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchRequests();
        setData(response);
      } catch (err) {
        setError('Failed to fetch requests.');
        Alert.alert('Error', 'Could not load request data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7ce216" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Loading requests...</Text>
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
      <Text style={styles.header}>Requests</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>New</Text>
        {data.newRequests.map((item) => (
          <RequestItem key={item.id} item={item} />
        ))}

        <Text style={styles.sectionTitle}>Accepted</Text>
        {data.acceptedRequests.map((item) => (
          <RequestItem key={item.id} item={item} />
        ))}
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111c10',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  scroll: {
    paddingBottom: 80,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d2a1a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  requestImage: {
    width: 48,
    height: 48,
    marginRight: 12,
    tintColor: '#ccc',
  },
  requestTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  requestSubtitle: {
    color: '#aaa',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111c10',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
