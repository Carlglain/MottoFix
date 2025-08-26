import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tutorials = [
  {
    id: '1',
    title: 'How to change a flat tire',
    duration: '10 min',
    image: require('../../assets/tire.png'),
  },
  {
    id: '2',
    title: 'How to jump start a car',
    duration: '15 min',
    image: require('../../assets/battery.png'),
  },
  {
    id: '3',
    title: 'How to check your oil',
    duration: '8 min',
    image: require('../../assets/engine.png'),
  },
  {
    id: '4',
    title: 'How to replace a headlight',
    duration: '12 min',
    image: require('../../assets/headlight.png'),
  },
  {
    id: '5',
    title: 'How to change your air filter',
    duration: '20 min',
    image: require('../../assets/airfilter.png'),
  },
];

export default function Tutorials({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutorials</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Learn the basics</Text>

      {/* Tutorials List */}
      <FlatList
        data={tutorials}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b0d', // dark greenish background
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2a1a',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  duration: {
    color: '#ccc',
    fontSize: 12,
  },
});
