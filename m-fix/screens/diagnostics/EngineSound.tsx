import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { ArrowLeft, Mic, BarChart3 } from 'lucide-react-native';
import Button from '../../components/ui/button';
import BottomNavigation from '../../navigation/BottomNavigation';

export default function RecordEngineSound() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const startWaveAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopWaveAnimation = () => {
    animation.stopAnimation();
  };

  const handleRecord = () => {
    setIsRecording(true);
    startWaveAnimation();
    setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
      stopWaveAnimation();
    }, 3000);
  };

  const handleStop = () => {
    setIsRecording(false);
    stopWaveAnimation();
  };

  const handlePlayback = () => {
    console.log('Playing back recording...');
  };

  const waveTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40], // Adjust based on number and spacing of bars
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft style={styles.arrowLeft} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Engine Sound</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Capture the sound of your engine to diagnose potential issues. Ensure the environment is quiet for accurate results.
          </Text>
        </View>

        {/* Recording Section */}
        <View style={styles.recordingSection}>
          <View style={styles.recordingSectionHeader}>
            <Text style={styles.recordingSectionHeaderText}>Recording</Text>
            <Mic style={styles.microphoneIcon} color={isRecording ? 'red' : '#666'} />
          </View>

          <View style={styles.recordingSectionHeader}>
            <Text style={styles.recordingSectionHeaderText}>Sound Wave Visualizer</Text>
            <BarChart3 style={styles.barChartIcon} color="#666" />
          </View>

          {/* Sound Wave Animation */}
          <View style={styles.soundWaveVisualization}>
            <Animated.View
              style={[
                styles.soundWaveVisualizationContainer,
                { transform: [{ translateX: waveTranslateX }] },
              ]}
            >
              {Array.from({ length: 40 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.soundWaveBar,
                    { height: Math.random() * 80 + 20 }, // Simulate wave
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          {/* Controls */}
          <View style={styles.controlButtons}>
            <Button
              onPress={handleRecord}
              disabled={isRecording}
              variant="primary"
              style={styles.controlButton}
            >
              {isRecording ? 'Recording...' : 'Record'}
            </Button>
            <Button
              onPress={handleStop}
              disabled={!isRecording}
              variant="secondary"
              style={styles.controlButton}
            >
              Stop
            </Button>
            <Button
              onPress={handlePlayback}
              disabled={!hasRecording || isRecording}
              variant="secondary"
              style={styles.controlButton}
            >
              Playback
            </Button>
          </View>
        </View>

        {/* Diagnosis Section */}
        {hasRecording && (
          <View style={styles.diagnosisSection}>
            <Text style={styles.diagnosisSectionTitle}>Diagnosis</Text>
            <View style={styles.diagnosisSectionContent}>
              <View style={styles.diagnosisSectionFaultType}>
                <Text style={styles.diagnosisSectionFaultTypeText}>Fault Type: Misfire</Text>
                <Text style={styles.diagnosisSectionFaultTypeConfidence}>85% Confidence</Text>
              </View>
              <Text style={styles.diagnosisSectionDescription}>
                A misfire occurs when one or more cylinders in your engine fail to ignite the air-fuel mixture properly. This can lead to reduced power, rough idling, and increased fuel consumption.
              </Text>
              <Button
                onPress={() => console.log('Get Tutorial pressed')}
                variant="primary"
                style={styles.getTutorialButton}
              >
                Get Tutorial
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowLeft: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  description: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#aaa',
  },
  recordingSection: {
    marginBottom: 16,
  },
  recordingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingSectionHeaderText: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff',
  },
  microphoneIcon: {
    width: 24,
    height: 24,
  },
  barChartIcon: {
    width: 24,
    height: 24,
  },
  soundWaveVisualization: {
    height: 100,
    overflow: 'hidden',
    marginBottom: 16,
  },
  soundWaveVisualizationContainer: {
    flexDirection: 'row',
    width: 1000,
  },
  soundWaveBar: {
    width: 6,
    marginRight: 4,
    backgroundColor: 'lime',
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  diagnosisSection: {
    marginBottom: 16,
  },
  diagnosisSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  diagnosisSectionContent: {
    marginBottom: 16,
  },
  diagnosisSectionFaultType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosisSectionFaultTypeText: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff',
  },
  diagnosisSectionFaultTypeConfidence: {
    fontSize: 14,
    color: 'lime',
  },
  diagnosisSectionDescription: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  getTutorialButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});
