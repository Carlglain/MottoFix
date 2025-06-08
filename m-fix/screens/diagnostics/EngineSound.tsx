import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EngineSound({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle', 'recording', 'stopped'
  const [audioUri, setAudioUri] = useState<any>(null);
  const [sound, setSound] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState('idle');

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement stop recording logic
    isRecording?console.log('Stopped recording'):console.log('Started recording');
  };

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

  React.useEffect(() => {
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
        <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
      </TouchableOpacity>

      <View style={styles.recordSoundContent}>
        <View style={styles.recordSoundIconContainer}>
          {recordingStatus === 'recording' ?
          <MaterialCommunityIcons name="waveform" size={100} color={Colors.appColors.white} style={styles.micIcon} />
          :
          <MaterialIcons name="mic" size={100} color={Colors.appColors.white} style={styles.micIcon} />
          }
        </View>
        <Text style={styles.recordingText}>{recordingStatus === 'recording'?"Recording...":"Record"}</Text>

        <TouchableOpacity style={styles.stopButton} onPress={recordingStatus === 'recording' ? stopRecording : startRecording}>
          {/* <Text style={styles.stopButtonText}>{isRecording?"Stop":"Start Record"}</Text> */}
          <Text style={styles.stopButtonText}>{recordingStatus === 'recording' ?"Stop":"Start Record"}</Text>
        </TouchableOpacity>

      {audioUri && (
        <View style={styles.playbackControls}>
          <Text style={styles.playbackText}>Recorded Audio Ready:</Text>
          {playbackStatus === 'playing' ? (
            <TouchableOpacity style={[styles.playSound,{backgroundColor:'#0047AB'}]} onPress={pauseSound} disabled={!audioUri}>
              <Text style={styles.playSoundText}>Pause Playback</Text>
            </TouchableOpacity>
          ) : playbackStatus === 'paused' ? (
            <TouchableOpacity style={[styles.playSound,{backgroundColor:'#0047AB'}]} onPress={resumeSound} disabled={!audioUri}>
              {/* <Text style={styles.stopButtonText}>{isRecording?"Stop":"Start Record"}</Text> */}
              <Text style={styles.playSoundText}>Resume Playback</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.playSound} onPress={playSound} disabled={!audioUri}>
              {/* <Text style={styles.stopButtonText}>{isRecording?"Stop":"Start Record"}</Text> */}
              <Text style={styles.playSoundText}>Play Recorded Sound</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.playSound,{backgroundColor:Colors.appColors.green,marginTop:10}]} disabled={!audioUri}>
            <Text style={styles.playSoundText}>Diagnos Engine</Text>
          </TouchableOpacity>
          <Text style={styles.statusText}>Playback Status: {playbackStatus}</Text>
        </View>
      )}

      {audioUri && (
        <Text style={styles.uriText}>URI: {audioUri}</Text>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recordSoundContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: Platform.OS === 'android' ? 'initial' : 0,
    marginBottom: Platform.OS === 'android' ? 50 : 0,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 20,
  },
  recordSoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  recordSoundIconContainer:{
    width:220,
    height:220,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderColor:Colors.appColors.white,
    borderWidth:4,
    borderRadius:9999,
    marginTop: 20,
    marginBottom: 20,
  },
  micIcon: {
    padding:20,
    alignSelf:'center'
  },
  recordingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginBottom: 30,
  },
  stopButton: {
    backgroundColor: Colors.appColors.white,
    width: Dimensions.get('window').width * 0.8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  stopButtonText: {
    color: Colors.appColors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  playbackControls: {
    marginTop: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    width: '100%',
  },
  playbackText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  uriText: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  playSound :{
    backgroundColor: '#0047AB',
    width: Dimensions.get('window').width * 0.8,
    // paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  playSoundText:{
    marginVertical: 15,
    fontSize: 16,
    color: 'white',
    fontWeight:'semibold'
  }
});