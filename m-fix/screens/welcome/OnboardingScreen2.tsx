import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen2 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Image
        source={{
          uri: 'https://www.tuningblog.eu/en/categories/tipps_tuev-dekra-u-co/carly-obd-app-236273/attachment/car-health-obd-tuning-diagnosis-test-report-1/',
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>Scan Dashboard Lights</Text>
      <Text style={styles.subtitle}>
        Identify car issues by scanning dashboard lights with your phone’s camera.
      </Text>

      <View style={styles.dotsContainer}>
        <View style={styles.inactiveDot} />
        <View style={styles.activeDot} />
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('HomeTabs')}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginTop: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 30,
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
    marginTop: 30,
    backgroundColor: '#8bc34a',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#3e4b26',
    borderRadius: 6,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default OnboardingScreen2;
