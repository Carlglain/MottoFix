import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const DiagnosticResults = ({ route, navigation }) => {
  const {
    diagnosis = "Diagnosis not available",
    severity = "low",
    description = "No detailed explanation available.",
    recommendation = "No recommendation provided.",
    costEstimate = "N/A",
    videoTitle = "Tutorial Video",
    videoChannel = "Auto Help Channel",
    videoUrl = ""
  } = route.params || {};

  const getSeverityColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'high':
      case 'critical': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const embedUrl = videoUrl.includes('youtube.com/watch')
    ? videoUrl.replace("watch?v=", "embed/")
    : videoUrl;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.diagnosisTitle}>{diagnosis}</Text>
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Severity:</Text>
          <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(severity) }]} />
          <Text style={styles.severityLabel}> {severity}</Text>
        </View>
        <Text style={styles.diagnosisDescription}>{description}</Text>
        {recommendation && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.diagnosisTitle}>Recommendation</Text>
            <Text style={styles.diagnosisDescription}>{recommendation}</Text>
          </View>
        )}
      </View>

      {embedUrl ? (
        <View style={[styles.section, styles.videoSection]}>
          <Text style={styles.videoHeader}>Related Video</Text>
          <Text style={styles.videoTitle}>{videoTitle}</Text>
          <Text style={styles.videoChannel}>{videoChannel}</Text>
          <WebView
            source={{ uri: embedUrl }}
            style={{ height: 220, width: screenWidth - 48, borderRadius: 8, backgroundColor: '#000', alignSelf: 'center' }}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            startInLoadingState
          />
        </View>
      ) : null}

      <View style={styles.costContainer}>
        <Text style={styles.costLabel}>Estimated Repair Cost</Text>
        <Text style={styles.costValue}>{costEstimate}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => console.log('Save Report')} style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Save Report</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Share Results')} style={[styles.button, styles.shareButton]}>
          <Text style={[styles.buttonText, styles.shareButtonText]}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainActions}>
        <TouchableOpacity onPress={() => navigation.navigate("Mechanic")} style={[styles.mainButton, styles.requestButton]}>
          <Text style={[styles.mainButtonText, styles.requestButtonText]}>Contact Mechanic</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('View Tutorial')} style={[styles.mainButton, styles.tutorialButton]}>
          <Text style={[styles.mainButtonText, styles.tutorialButtonText]}>View Tutorial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 80,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
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
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  severityLabel: {
    fontSize: 18,
    color: '#D1D5DB',
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  diagnosisDescription: {
    color: '#D1D5DB',
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
   
  },
  videoSection: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
  },
  videoHeader: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 4,
  },
  videoChannel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  costLabel: {
    fontSize: 18,
    color: '#D1D5DB',
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
    backgroundColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#111827',
  },
  shareButton: {
    backgroundColor: '#E5E7EB',
  },
  shareButtonText: {
    color: '#111827',
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
    backgroundColor: '#E5E7EB',
  },
  requestButtonText: {
    color: '#111827',
  },
  tutorialButton: {
    backgroundColor: '#E5E7EB',
  },
  tutorialButtonText: {
    color: '#111827',
  },
});

export default DiagnosticResults;
