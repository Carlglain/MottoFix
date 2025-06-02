import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { ArrowLeft, Camera, ImageIcon, Target, AlertTriangle } from 'lucide-react-native';
import Button from '../../components/ui/button';
import BottomNavigation from '../../navigation/BottomNavigation';

export default function ScanDashboardLight() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [showSavedPhotos, setShowSavedPhotos] = useState(false);
  const [savedPhotos] = useState([
    { id: 1, uri: 'https://example.com/photo1.jpg' },
    { id: 2, uri: 'https://example.com/photo2.jpg' },
  ]);

  const handleCapture = () => {
    setIsCapturing(true);
    setShowGallery(false);
    setShowSavedPhotos(false);

    setTimeout(() => {
      setIsCapturing(false);
      setIsProcessing(true);
      setAnalysisText('Analyzing the dashboard light');

      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsProcessing(false);
            setShowResults(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }, 1000);
  };

  const handleGallery = () => {
    setShowGallery(true);
    setShowSavedPhotos(false);
    setShowResults(false);
    setIsProcessing(false);
  };

  const handleSavedPhotos = () => {
    setShowSavedPhotos(true);
    setShowGallery(false);
    setShowResults(false);
    setIsProcessing(false);
  };

  const handleFocus = () => {
    console.log('Focusing camera...');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ArrowLeft style={styles.arrowLeft} />
        <Text style={styles.headerTitle}>Scan Dashboard Light</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Camera Interface */}
        <View style={styles.cameraInterface}>
          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity onPress={handleGallery} style={styles.galleryButton}>
              <ImageIcon style={styles.galleryIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCapture}
              disabled={isCapturing || isProcessing}
              style={[
                styles.captureButton,
                isCapturing ? styles.recordingCapture : styles.pausedCapture,
              ]}
            >
              <Camera style={styles.cameraControlIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSavedPhotos} style={styles.focusButton}>
              <Target style={styles.focusIcon} />
            </TouchableOpacity>
          </View>

          {/* Gallery View */}
          {showGallery && (
            <View style={styles.galleryContainer}>
              <Text style={styles.sectionTitle}>Select from Gallery</Text>
              <View style={styles.galleryGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <View key={item} style={styles.galleryItem}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/150' }} 
                      style={styles.galleryImage} 
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Saved Photos View */}
          {showSavedPhotos && (
            <View style={styles.galleryContainer}>
              <Text style={styles.sectionTitle}>Your Saved Scans</Text>
              {savedPhotos.length > 0 ? (
                <View style={styles.galleryGrid}>
                  {savedPhotos.map((photo) => (
                    <View key={photo.id} style={styles.galleryItem}>
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.galleryImage} 
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No saved scans yet</Text>
              )}
            </View>
          )}

          {/* Camera Viewfinder */}
          {!showGallery && !showSavedPhotos && (
            <View style={styles.cameraViewfinder}>
              <View style={styles.viewfinderContainer}>
                {isCapturing && (
                  <View
                    style={[
                      styles.viewfinderOverlay,
                      {
                        opacity: isCapturing ? 1 : 0,
                        transform: [
                          {
                            scale: isCapturing ? 1 : 0.5,
                          },
                        ],
                      },
                    ]}
                  />
                )}
                <Camera style={styles.viewfinderCameraIcon} />
              </View>
            </View>
          )}

          {/* Green indicator line */}
          <View style={styles.indicatorLine} />
        </View>

        {/* Instructions and Controls */}
        {!showGallery && !showSavedPhotos && (
          <View style={styles.instructionsAndControls}>
            <View style={styles.captureInstructions}>
              <Text style={styles.captureInstructionsText}>
                Point your camera at the dashboard light
              </Text>
              <Button
                onPress={handleCapture}
                disabled={isCapturing || isProcessing}
                variant="primary"
                style={styles.fullWidthCaptureButton}
              >
                {isCapturing ? 'Capturing...' : 'Capture'}
              </Button>
            </View>

            {/* Processing Section */}
            {(isProcessing || showResults) && (
              <View style={styles.processingSection}>
                <View style={styles.processingTextContainer}>
                  <Text style={styles.processingText}>Processing...</Text>
                  <View style={styles.progressIndicator}>
                    <View
                      style={[
                        styles.progressIndicatorFilled,
                        {
                          width: `${processingProgress}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.analysisText}>{analysisText}</Text>
                </View>
              </View>
            )}

            {/* Results Section */}
            {showResults && (
              <View style={styles.resultsSection}>
                <View style={styles.resultContainer}>
                  <View style={styles.resultIconContainer}>
                    <AlertTriangle style={styles.resultIcon} />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultHeaderText}>Engine Malfunction</Text>
                    <Text style={styles.resultSubtext}>Critical</Text>
                  </View>
                </View>

                <Text style={styles.resultDescription}>
                  This light indicates a serious issue with the engine. It's crucial to address this immediately to
                  prevent further damage.
                </Text>

                <Button 
                  onPress={() => setShowResults(false)}
                  variant="primary" 
                  style={styles.getTutorialButton}
                >
                  Get Tutorial
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C240F',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for navbar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  arrowLeft: {
    width: 24,
    height: 24,
    marginRight: 12,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraInterface: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 30, // Closer spacing
  },
  galleryButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3A4A1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    width: 24,
    height: 24,
    color: '#fff',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5A7D28',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCapture: {
    backgroundColor: '#D32F2F',
  },
  pausedCapture: {
    backgroundColor: '#3A4A1D',
  },
  cameraControlIcon: {
    width: 32,
    height: 32,
    color: '#fff',
  },
  focusButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3A4A1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusIcon: {
    width: 24,
    height: 24,
    color: '#fff',
  },
  cameraViewfinder: {
    flex: 1,
    backgroundColor: '#2C3A0F',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: 1, // Square viewfinder
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  viewfinderCameraIcon: {
    width: 100,
    height: 100,
    color: '#5A7D28',
  },
  indicatorLine: {
    width: 4,
    height: 100,
    backgroundColor: '#5A7D28',
    borderRadius: 2,
    position: 'absolute',
    top: '50%',
    left: 16,
    marginTop: -50,
  },
  instructionsAndControls: {
    padding: 16,
  },
  captureInstructions: {
    marginBottom: 16,
  },
  captureInstructionsText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  fullWidthCaptureButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#5A7D28',
  },
  processingSection: {
    marginTop: 16,
  },
  processingTextContainer: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  progressIndicator: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A4A1D',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressIndicatorFilled: {
    height: 8,
    backgroundColor: '#5A7D28',
  },
  analysisText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  resultsSection: {
    marginTop: 16,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#3A4A1D',
    padding: 16,
    borderRadius: 8,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2C3A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIcon: {
    width: 24,
    height: 24,
    color: '#D32F2F',
  },
  resultTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  resultHeaderText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#D32F2F',
  },
  resultDescription: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 24,
  },
  getTutorialButton: {
    width: '100%',
    backgroundColor: '#5A7D28',
  },
  galleryContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    backgroundColor: '#3A4A1D',
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
});