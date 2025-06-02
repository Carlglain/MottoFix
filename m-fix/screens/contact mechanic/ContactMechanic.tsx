import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
const ContactMechanic = () => {
  return (
    <ScrollView style={styles.container}>
    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', }}>
     <Ionicons name="arrow-back" size={24} color="white" />
      <Text style={styles.header}>Contact Mechanic</Text>
    </View>
      <View style={styles.mechanicList}>
        {Array.from({ length: 4 }, (_, index) => (
          <View key={index} style={styles.mechanicItem}>
            <Image 
              source={require('../../assets/mechanic.png')} 
              style={styles.mechanicImage} 
            />
            <View style={styles.mechanicInfo}>
              <Text style={styles.mechanicName}>Mechanic {index + 1}</Text>
              <Text style={styles.mechanicStatus}>Available</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          <EvilIcons name="location" size={24} color="black" /> Find Mechanics Near Me
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 40,
    paddingHorizontal: 20, 
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left', 
  },
  mechanicList: {
    marginBottom: 50,
  },
  mechanicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  mechanicImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mechanicStatus: {
    color: '#AAAAAA',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactMechanic;