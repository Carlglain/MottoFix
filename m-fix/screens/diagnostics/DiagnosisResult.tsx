import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Play } from 'lucide-react-native';
import BottomNavigation from '../../navigation/BottomNavigation';

const DiagnosticResults = () => {
  const handleSaveReport = () => {
    console.log("Saving report...");
  };

  const handleShare = () => {
    console.log("Sharing results...");
  };

  const handleRequestMechanic = () => {
    console.log("Requesting mechanic...");
  };

  const handleViewTutorial = () => {
    console.log("Opening tutorial...");
  };

  const handlePlayVideo = () => {
    console.log("Playing video...");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft size={24} color="white" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnostic Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.diagnosisTitle}>Engine Misfire Detected</Text>

          <View style={styles.severityContainer}>
            <Text style={styles.severityLabel}>Severity</Text>
            <View style={styles.severityIndicator} />
          </View>

          <Text style={styles.diagnosisDescription}>
            Our AI analysis indicates an engine misfire, potentially due to faulty spark plugs or fuel injectors. This
            can lead to reduced engine power and increased fuel consumption. We recommend immediate inspection.
          </Text>
        </View>

        {/* Related Video */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Related Video</Text>
          <TouchableOpacity style={styles.videoCard} onPress={handlePlayVideo}>
            <View style={styles.videoThumbnail}>
              <Image
                source={require('./mechanic.webp')}
                style={styles.videoImage}
                resizeMode="cover"
              />
              <View style={styles.playButton}>
                <Play size={16} color="black" />
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>How to Fix Engine Misfire</Text>
              <Text style={styles.videoChannel}>Auto Repair Channel</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Estimated Repair Cost */}
        <View style={styles.costContainer}>
          <Text style={styles.costLabel}>Estimated Repair Cost</Text>
          <Text style={styles.costValue}>20k - 50k FCFA</Text>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSaveReport}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Save Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
            <Text style={[styles.buttonText, styles.shareButtonText]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Main Action Buttons */}
        <View style={styles.mainActions}>
          <TouchableOpacity style={[styles.mainButton, styles.requestButton]} onPress={handleRequestMechanic}>
            <Text style={[styles.mainButtonText, styles.requestButtonText]}>Request Mechanic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainButton, styles.tutorialButton]} onPress={handleViewTutorial}>
            <Text style={[styles.mainButtonText, styles.tutorialButtonText]}>View Tutorial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C240F', // gray-900 equivalent
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151', // gray-700 equivalent
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: '#9CA3AF', // gray-400 equivalent
    fontSize: 14,
    marginBottom: 16,
  },
  diagnosisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    lineHeight: 32,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  severityLabel: {
    fontSize: 18,
    color: '#D1D5DB', // gray-300 equivalent
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981', // green-500 equivalent
  },
  diagnosisDescription: {
    color: '#D1D5DB', // gray-300 equivalent
    lineHeight: 24,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#5F694F', // gray-800 equivalent
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: 80,
    height: 56,
    backgroundColor: '#374151', // gray-700 equivalent
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    color: 'white',
    fontWeight: '500',
    marginBottom: 4,
  },
  videoChannel: {
    color: '#9CA3AF', // gray-400 equivalent
    fontSize: 14,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151', // gray-700 equivalent
  },
  costLabel: {
    fontSize: 18,
    color: '#D1D5DB', // gray-300 equivalent
  },
  costValue: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB', // gray-200 equivalent
  },
  secondaryButtonText: {
    color: '#111827', // gray-900 equivalent
  },
  shareButton: {
    backgroundColor: '#E5E7EB', // gray-200 equivalent
  },
  shareButtonText: {
    color: '#111827', // gray-900 equivalent
  },
  mainActions: {
    gap: 16,
  },
  mainButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  requestButton: {
    backgroundColor: '#E5E7EB', // gray-200 equivalent
  },
  requestButtonText: {
    color: '#111827', // gray-900 equivalent
  },
  tutorialButton: {
    backgroundColor: '#E5E7EB', // gray-200 equivalent
  },
  tutorialButtonText: {
    color: '#111827', // gray-900 equivalent
  },
});

export default DiagnosticResults;