import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EngineSound({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle', 'recording', 'stopped'
  const [audioUri, setAudioUri] = useState<any>(null);
  const [sound, setSound] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState('idle');
  
  // New states for analysis
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  async function startRecording() {
    try {
      // 1. Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // 2. Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false, // Set to true if you need background recording
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // 3. Create a new Audio.Recording instance and prepare it
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecordingStatus('recording');
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      setRecordingStatus('idle');
    }
  }

  async function stopRecording() {
    setRecordingStatus('stopped');
    console.log('Stopping recording');

    if (!recording) return; // Ensure recording object exists

    try {
      // 1. Stop and unload the recording
      await recording.stopAndUnloadAsync();

      // 2. Get the URI of the recorded file
      const uri = recording.getURI();
      setAudioUri(uri);
      console.log('Recording stopped and stored at', uri);

      // 3. Reset recording state
      setRecording(null);

      // 4. Set audio mode back to non-recording (optional, but good practice)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true, // Allow sound to play through earpiece
      });

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function playSound() {
    if (!audioUri) {
      alert('No audio recorded yet!');
      return;
    }
    if (sound) {
      // If sound is already loaded, just play it
      await sound.replayAsync();
      setPlaybackStatus('playing');
      return;
    }

    try {
      // 1. Load the recorded sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && !status.isPlaying && status.positionMillis > 0) {
            setPlaybackStatus('idle'); // Reset status when playback finishes
            newSound.unloadAsync(); // Unload sound when finished (optional)
            setSound(null); // Clear sound object
          }
        }
      );
      setSound(newSound);
      setPlaybackStatus('playing');
      console.log('Playing sound');

    } catch (error) {
      console.error('Failed to play sound', error);
      setPlaybackStatus('idle');
    }
  }

  async function pauseSound() {
    if (sound && playbackStatus === 'playing') {
      await sound.pauseAsync();
      setPlaybackStatus('paused');
      console.log('Sound paused');
    }
  }

  async function resumeSound() {
    if (sound && playbackStatus === 'paused') {
      await sound.playAsync();
      setPlaybackStatus('playing');
      console.log('Sound resumed');
    }
  }

  const handleAnalyzeSound = async () => {
    if (!audioUri) {
      Alert.alert('No Audio', 'Please record an engine sound first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      // 1. Convert audio file to a base64 string
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Prepare the JSON payload
      const payload = {
        // Replace with actual user/vehicle ID from your app's state management
        userId: 'user123', 
        vehicleId: 'vehicle456',
        inputData: base64Audio,
        originalName: `recording-${Date.now()}.m4a`, // Pass filename for context
      };

      // IMPORTANT: Replace with your actual backend IP/URL
      const response = await fetch('http://192.168.96.1:3000/diagnose/sound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data.result);
    } catch (error: any) {
      console.error('Analysis Error:', error);
      setAnalysisError(error.message || 'An unknown error occurred during analysis.');
      Alert.alert('Error', error.message || 'Failed to analyze the sound. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAudioUri(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setPlaybackStatus('idle');
    setRecordingStatus('idle');
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const openVideoTutorial = () => {
    if (analysisResult?.videoUrl) {
      Linking.openURL(analysisResult.videoUrl).catch(err => 
        Alert.alert("Cannot open URL", "An error occurred while trying to open the video link.")
      );
    }
  };

  useEffect(() => {
    // Unload the sound when the component unmounts
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={styles.recordSoundContainer}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
          <Ionicons name="chevron-back" size={28} color="#A4D65E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Engine Diagnostics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.recordSoundContent}>
          {/* Show recording UI only if no result is present */}
          {!analysisResult && !audioUri && (
            <View style={styles.recordingSection}>
              <View style={styles.recordSoundIconContainer}>
                <View style={styles.innerCircle}>
                  {recordingStatus === 'recording' ? (
                    <MaterialCommunityIcons name="waveform" size={80} color="#A4D65E" style={styles.micIcon} />
                  ) : (
                    <MaterialIcons name="mic" size={80} color="#A4D65E" style={styles.micIcon} />
                  )}
                </View>
                {recordingStatus === 'recording' && <View style={styles.recordingPulse} />}
              </View>
              
              <Text style={styles.recordingText}>
                {recordingStatus === 'recording' ? "Recording Engine Sound..." : "Ready to Record"}
              </Text>
              
              <Text style={styles.subtitleText}>
                {recordingStatus === 'recording' 
                  ? "Capturing audio for analysis" 
                  : "Tap to start engine sound recording"
                }
              </Text>

              <TouchableOpacity 
                style={[styles.recordButton, recordingStatus === 'recording' && styles.recordButtonActive]} 
                onPress={recordingStatus === 'recording' ? stopRecording : startRecording}
                disabled={isAnalyzing}
              >
                <Text style={[styles.recordButtonText, recordingStatus === 'recording' && styles.recordButtonTextActive]}>
                  {recordingStatus === 'recording' ? "Stop Recording" : "Start Recording"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Playback and Analysis Section */}
          {audioUri && !analysisResult && (
            <View style={styles.playbackSection}>
              <View style={styles.divider} />
              
              <Text style={styles.playbackTitle}>Audio Analysis</Text>
              <Text style={styles.playbackSubtitle}>Review your recorded engine sound</Text>
              
              <View style={styles.playbackControls}>
                {playbackStatus === 'playing' ? (
                  <TouchableOpacity style={styles.controlButton} onPress={pauseSound}>
                    <Ionicons name="pause" size={24} color="#000" />
                    <Text style={styles.controlButtonText}>Pause</Text>
                  </TouchableOpacity>
                ) : playbackStatus === 'paused' ? (
                  <TouchableOpacity style={styles.controlButton} onPress={resumeSound}>
                    <Ionicons name="play" size={24} color="#000" />
                    <Text style={styles.controlButtonText}>Resume</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.controlButton} onPress={playSound}>
                    <Ionicons name="play" size={24} color="#000" />
                    <Text style={styles.controlButtonText}>Play Audio</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.diagnoseButton, isAnalyzing && styles.diagnoseButtonDisabled]}
                  onPress={handleAnalyzeSound}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <MaterialIcons name="analytics" size={24} color="#000" />
                  )}
                  <Text style={styles.diagnoseButtonText}>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Engine'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, playbackStatus === 'playing' && styles.statusIndicatorActive]} />
                <Text style={styles.statusText}>
                  Status: {playbackStatus.charAt(0).toUpperCase() + playbackStatus.slice(1)}
                </Text>
              </View>
            </View>
          )}

          {/* Analysis Result Section */}
          {analysisResult && (
            <View style={styles.resultsSection}>
              <View style={styles.resultContainer}>
                <View style={styles.resultIconContainer}>
                  <MaterialIcons name="error-outline" size={32} color="#FF6B6B" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultHeaderText}>{analysisResult.faultName}</Text>
                  <Text style={styles.resultSubtext}>Engine Sound Diagnosis</Text>
                </View>
              </View>

              <View style={styles.explanationSection}>
                <Text style={styles.explanationTitle}>Explanation</Text>
                <Text style={styles.explanationText}>{analysisResult.explanation}</Text>
              </View>

              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>Recommendation</Text>
                <Text style={styles.recommendationText}>{analysisResult.recommendation}</Text>
              </View>

              <View style={styles.buttonContainer}>
                {analysisResult.videoUrl && (
                  <TouchableOpacity onPress={openVideoTutorial} style={[styles.controlButton, styles.getTutorialButton]}>
                    <MaterialCommunityIcons name="youtube" size={24} color="#000" />
                    <Text style={styles.controlButtonText}>Watch Tutorial</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={resetAnalysis} style={[styles.controlButton, styles.scanAgainButton]}>
                  <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
                  <Text style={[styles.controlButtonText, { color: '#FFFFFF' }]}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Error Section */}
          {analysisError && (
            <View style={styles.errorSection}>
              <Text style={styles.errorText}>{analysisError}</Text>
              <TouchableOpacity onPress={resetAnalysis} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  recordSoundContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 44,
  },
  recordSoundContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  recordingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  recordSoundIconContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A4D65E',
    borderRadius: 100,
    backgroundColor: '#1A1A1A',
    marginBottom: 30,
    position: 'relative',
    shadowColor: '#A4D65E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  recordingPulse: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#A4D65E',
    opacity: 0.3,
  },
  micIcon: {
    alignSelf: 'center',
  },
  recordingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  recordButton: {
    backgroundColor: '#A4D65E',
    width: width * 0.8,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#A4D65E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: '#FF4444',
    shadowColor: '#FF4444',
  },
  recordButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  recordButtonTextActive: {
    color: '#FFFFFF',
  },
  playbackSection: {
    paddingVertical: 30,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 30,
  },
  playbackTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  playbackSubtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 25,
    textAlign: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A4D65E',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  diagnoseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7ED321',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  diagnoseButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444444',
  },
  statusIndicatorActive: {
    backgroundColor: '#A4D65E',
  },
  statusText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  // Styles for results, adapted from DashboardScan.tsx
  resultsSection: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
  },
  resultIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultHeaderText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 4,
  },
  explanationSection: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A4D65E',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#DDDDDD',
    lineHeight: 22,
  },
  recommendationSection: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A4D65E',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 15,
    color: '#DDDDDD',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  getTutorialButton: {
    backgroundColor: '#A4D65E',
  },
  scanAgainButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A4D65E',
  },
  errorSection: {
    backgroundColor: '#2D1B1B',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});