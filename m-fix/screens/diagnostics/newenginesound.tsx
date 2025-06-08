import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import { ArrowLeft, Mic, BarChart3 } from 'lucide-react-native';
import Button from '../../components/ui/button';
import BottomNavigation from '../../navigation/BottomNavigation';
import * as RNFS from 'react-native-fs';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);

export default function RecordEngineSound({navigation}) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingPath, setRecordingPath] = useState('');
  const [recordTime, setRecordTime] = useState('00:00');
  const [playTime, setPlayTime] = useState('00:00');
  const [currentMetering, setCurrentMetering] = useState(0);
  
  const animation = useRef(new Animated.Value(0)).current;
  const waveHeights = useRef(Array.from({ length: 50 }, () => useRef(new Animated.Value(20)).current)).current;
  const recordingTimer = useRef(null);

  const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVModeIOS: AVModeIOSOption.measurement,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
    OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
  };

  const startWaveAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopWaveAnimation = () => {
    animation.stopAnimation();
    // Reset all wave heights to minimum
    waveHeights.forEach(height => {
      Animated.timing(height, {
        toValue: 20,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const animateWaveHeights = (meteringLevel) => {
    // Convert metering level to a usable range (0-100)
    const normalizedLevel = Math.max(0, Math.min(100, meteringLevel + 40));
    
    waveHeights.forEach((height, index) => {
      // Create variation in wave heights based on metering and randomness
      const variation = Math.random() * 0.5 + 0.5; // 0.5 to 1
      const targetHeight = 20 + (normalizedLevel * variation * 0.8); // 20 to 100
      
      Animated.timing(height, {
        toValue: targetHeight,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleRecord = async () => {
    try {
      const dirs = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.ExternalDirectoryPath;
      
      const path = Platform.select({
        ios: `${dirs}/engine_sound_${Date.now()}.m4a`,
        android: `${dirs}/engine_sound_${Date.now()}.mp3`,
      });

      console.log('Recording to path:', path);

      const result = await audioRecorderPlayer.startRecorder(path, audioSet, true);
      
      setIsRecording(true);
      setRecordingPath(result);
      startWaveAnimation();

      // Set up recording listener for metering data
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setCurrentMetering(e.currentMetering || 0);
        animateWaveHeights(e.currentMetering || 0);
        
        // Auto-stop after 10 seconds
        if (e.currentPosition >= 10000) {
          handleStop();
        }
      });

      // Set timer to auto-stop after 10 seconds
      recordingTimer.current = setTimeout(() => {
        handleStop();
      }, 10000);

    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  const handleStop = async () => {
    if (!isRecording) return;
    
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      
      setIsRecording(false);
      setHasRecording(true);
      stopWaveAnimation();
      
      if (recordingTimer.current) {
        clearTimeout(recordingTimer.current);
      }
      
      console.log('Recording stopped:', result);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const handlePlayback = async () => {
    if (!recordingPath || isRecording) return;

    try {
      if (isPlaying) {
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying(false);
        audioRecorderPlayer.removePlayBackListener();
      } else {
        await audioRecorderPlayer.startPlayer(recordingPath);
        setIsPlaying(true);
        
        audioRecorderPlayer.addPlayBackListener((e) => {
          setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
          
          if (e.currentPosition === e.duration) {
            setIsPlaying(false);
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      }
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Playback Error', 'Failed to play recording. Please try again.');
    }
  };

  const handleAnalyse = async () => {
    if (!recordingPath) {
      Alert.alert('No Recording', 'Please record audio first before analyzing.');
      return;
    }

    try {
      // Here you can add your analysis logic
      // For now, we'll just show the diagnosis section
      Alert.alert('Analysis', 'Audio analysis feature will be implemented here.');
      
      // You can call your uploadAudio function here
      // await uploadAudio(recordingPath);
      
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Error', 'Failed to analyze audio. Please try again.');
    }
  };

  const waveTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200], // Move from right to left
  });

  useEffect(() => {
    return () => {
      if (recordingTimer.current) {
        clearTimeout(recordingTimer.current);
      }
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={styles.arrowLeft} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Engine Sound Recorder</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Capture the sound of your engine to diagnose potential issues. Ensure the environment is quiet for accurate results. Recording will automatically stop after 10 seconds.
          </Text>
        </View>

        {/* Recording Section */}
        <View style={styles.recordingSection}>
          <View style={styles.recordingSectionHeader}>
            <Text style={styles.recordingSectionHeaderText}>Recording</Text>
            <Mic style={styles.microphoneIcon} color={isRecording ? '#ff4444' : '#666'} />
          </View>

          {/* Recording Time Display */}
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>
              {isRecording ? recordTime : (isPlaying ? playTime : '00:00')}
            </Text>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>REC</Text>
              </View>
            )}
          </View>

          <View style={styles.recordingSectionHeader}>
            <Text style={styles.recordingSectionHeaderText}>Sound Wave Visualizer</Text>
            <BarChart3 style={styles.barChartIcon} color="#666" />
          </View>

          {/* Enhanced Sound Wave Animation */}
          <View style={styles.soundWaveVisualization}>
            <Animated.View
              style={[
                styles.soundWaveVisualizationContainer,
                { transform: [{ translateX: waveTranslateX }] },
              ]}
            >
              {waveHeights.map((height, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.soundWaveBar,
                    { 
                      height: height,
                      opacity: isRecording ? 1 : 0.3,
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          {/* Controls */}
          <View style={styles.controlButtons}>
            <Button
              onPress={handleRecord}
              disabled={isRecording || isPlaying}
              variant="primary"
              style={[styles.controlButton, isRecording && styles.recordingButton]}
            >
              {isRecording ? `Recording... ${recordTime}` : 'Record'}
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
              {isPlaying ? 'Stop Play' : 'Playback'}
            </Button>
          </View>

          {/* Analyse Button */}
          {hasRecording && (
            <View style={styles.analyseButtonContainer}>
              <Button
                onPress={handleAnalyse}
                disabled={isRecording || isPlaying}
                variant="primary"
                style={styles.analyseButton}
              >
                Analyse Sound
              </Button>
            </View>
          )}
        </View>

        {/* Diagnosis Section */}
        {hasRecording && (
          <View style={styles.diagnosisSection}>
            <Text style={styles.diagnosisSectionTitle}>Analysis Results</Text>
            <View style={styles.diagnosisSectionContent}>
              <View style={styles.recordingInfo}>
                <Text style={styles.recordingInfoText}>
                  Recording Path: {recordingPath.split('/').pop()}
                </Text>
                <Text style={styles.recordingInfoText}>
                  Duration: {recordTime}
                </Text>
              </View>
              <Text style={styles.diagnosisSectionDescription}>
                Your engine sound has been recorded successfully. Click "Analyse Sound" to get AI-powered diagnostic insights, or proceed to get repair tutorials.
              </Text>
              <Button
                onPress={() => navigation.navigate('Results')}
                variant="primary"
                style={styles.getTutorialButton}
              >
                Get Tutorial
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
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
    lineHeight: 22,
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
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginRight: 4,
  },
  recordingText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  soundWaveVisualization: {
    height: 120,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
  },
  soundWaveVisualizationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  soundWaveBar: {
    width: 4,
    marginRight: 2,
    backgroundColor: '#00ff88',
    borderRadius: 2,
    minHeight: 4,
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
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  analyseButtonContainer: {
    marginTop: 16,
  },
  analyseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ff6b35',
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
  recordingInfo: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  recordingInfoText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  diagnosisSectionDescription: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
    lineHeight: 22,
  },
  getTutorialButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});