import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const OnboardingScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appName}>MFix</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar} />
      </View>

      <Text style={styles.title}>Know Your Car, Drive Smart</Text>

      <Image
        source={require('../../assets/carimage.jpeg')}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.dotsContainer}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Onboarding2')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.replace('Login')} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  appName: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
    // fontWeight: '1000',
  },
  progressBarContainer: {
    width: '90%',
    height: 4,
    backgroundColor: '#3e4b26',
    borderRadius: 10,
    marginTop: 10,
  },
  progressBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#8bc34a',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  image: {
    // width: '390',
    height: 292.12,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8bc34a',
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3e4b26',
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: '#8bc34a',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    padding: 8,
    backgroundColor: '#3e4b26',
    borderRadius: 6,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 14,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: 'gray',
  },
});

export default OnboardingScreen;