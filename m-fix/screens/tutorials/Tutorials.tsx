import React, {useEffect,useState} from 'react';
import { useEvent,useEventListener } from 'expo';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Button} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

 export default function Tutorials(){
     const player = useVideoPlayer('https://www.youtube.com/watch?v=HZ7wAXpTdV0', player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });


  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tutorial</Text>

      <View style={styles.videoContainer}>
         <VideoView
       style={styles.video} 
        
        player={player}
        // resizeMode="contain"
        // isLooping
        
    />
    <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
      </View>

      <Text style={styles.subHeader}>Step-by-step guide</Text>
      <Text style={styles.step}>1. Gather tools and parts</Text>
      <Text style={styles.step}>2. Locate the faulty component</Text>
      <Text style={styles.step}>3. Disconnect the component</Text>
      <Text style={styles.step}>4. Install the new component</Text>
      <Text style={styles.step}>5. Test the repair</Text>

      <Text style={styles.subHeader}>Required tools and parts</Text>
      <View style={styles.toolsContainer}>
        {['Wrench set', 'Replacement part', 'Safety gloves'].map((tool, index) => (
          <View key={index} style={styles.toolItem}>
            <TouchableOpacity style={styles.checkbox} />
            <Text style={styles.toolText}>{tool}</Text>
          </View>
        ))}
         <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
            <Text style={styles.label}>Mark as Completed   </Text>
            <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}

          />
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left',
  },
  
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  videoImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#333', // Placeholder color
  },
  subHeader: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  step: {
    color: '#AAAAAA',
    fontSize: 16,
    marginBottom: 5,
  },
  toolsContainer: {
    margin: 10,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 4,
    marginRight: 10,
  },
  label: {
    color: '#fff',
    marginRight: 10,
    fontSize: 18,
  },
  toolText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
