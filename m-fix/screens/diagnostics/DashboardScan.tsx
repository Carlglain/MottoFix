import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, ImageIcon, Target, AlertTriangle, RotateCcw, ExternalLink } from 'lucide-react-native';
import Button from '../../components/ui/button';
import BottomNavigation from '../../navigation/BottomNavigation';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const API_BASE_URL = 'http://192.168.96.1:3000'; // Change this to your backend URL

export default function ScanDashboardLight({navigation}) {
  // Camera states
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  // Existing states
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [showSavedPhotos, setShowSavedPhotos] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [activeButton, setActiveButton] = useState('camera');
  
  // Backend response state
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [savedPhotos] = useState([
    { id: 1, uri: 'https://example.com/photo1.jpg' },
    { id: 2, uri: 'https://example.com/photo2.jpg' },
  ]);

  // Convert image to base64
  const convertImageToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  // Send image to backend for diagnosis
  const sendImageForDiagnosis = async (imageUri) => {
    try {
      setIsProcessing(true);
      setError(null);
      setAnalysisText('Converting image...');
      setProcessingProgress(20);

      // Convert image to base64
      const base64Image = await convertImageToBase64(imageUri);
      
      setAnalysisText('Sending to AI for analysis...');
      setProcessingProgress(40);

      // Prepare request payload
      const payload = {
        userId: 'user123', // Replace with actual user ID
        vehicleId: 'vehicle456', // Replace with actual vehicle ID if available
        inputData: base64Image // base64 encoded image without prefix
      };

      setAnalysisText('AI is analyzing the dashboard light...');
      setProcessingProgress(60);

      // Send to backend
      const response = await fetch(`${API_BASE_URL}/diagnose/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setProcessingProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to diagnose image');
      }

      const result = await response.json();
      
      setAnalysisText('Analysis complete!');
      setProcessingProgress(100);

      // Store the result
      setDiagnosisResult(result.result);
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowResults(true);
      }, 500);

    } catch (error) {
      console.error('Diagnosis error:', error);
      setError(error.message || 'Failed to analyze image');
      setAnalysisText('Analysis failed');
      setIsProcessing(false);
      Alert.alert('Error', error.message || 'Failed to analyze the image. Please try again.');
    }
  };

  // Camera permission check
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need your permission to use the camera for scanning dashboard lights
          </Text>
          <Button onPress={requestPermission} variant="primary" style={styles.permissionButton}>
            Grant Camera Permission
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Toggle camera facing (front/back)
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Handle gallery selection
  const handleGallery = async () => {
    setActiveButton('gallery');
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to select images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Go to Settings', 
              onPress: () => {
                Alert.alert('Please enable photo library access in your device settings.');
              }
            }
          ]
        );
        setActiveButton('camera');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setSelectedGalleryImage(selectedImage.uri);
        setCapturedImage(selectedImage.uri);
        setShowGallery(false);
        setShowSavedPhotos(false);
        
        // Send to backend for analysis
        await sendImageForDiagnosis(selectedImage.uri);
      } else {
        setActiveButton('camera');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to access photo library');
      setActiveButton('camera');
    }
  };

  // Handle camera button - either capture or retake
  const handleCameraButton = async () => {
    if (capturedImage) {
      resetCapture();
      setActiveButton('camera');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      setIsCapturing(true);
      setShowGallery(false);
      setShowSavedPhotos(false);
      setActiveButton('camera');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      setCapturedImage(photo.uri);
      setSelectedGalleryImage(null);
      
      setTimeout(async () => {
        setIsCapturing(false);
        // Send to backend for analysis
        await sendImageForDiagnosis(photo.uri);
      }, 1000);

    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image');
      setIsCapturing(false);
      setActiveButton('camera');
    }
  };

  const handleSavedPhotos = () => {
    setShowSavedPhotos(true);
    setShowGallery(false);
    setShowResults(false);
    setIsProcessing(false);
    setActiveButton('saved');
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setSelectedGalleryImage(null);
    setShowResults(false);
    setIsProcessing(false);
    setProcessingProgress(0);
    setShowSavedPhotos(false);
    setDiagnosisResult(null);
    setError(null);
  };

  // Open video tutorial
  const openVideoTutorial = () => {
    if (diagnosisResult?.videoUrl) {
      // In a real app, you'd use Linking.openURL(diagnosisResult.videoUrl)
      Alert.alert('Video Tutorial', `Opening: ${diagnosisResult.videoUrl}`);
    }
  };

  // Get the current image source info
  const getImageSourceInfo = () => {
    if (selectedGalleryImage) {
      return 'Image selected from gallery';
    } else if (capturedImage) {
      return 'Image captured successfully!';
    } else {
      return 'Point your camera at the dashboard light';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Camera Interface */}
        <View style={styles.cameraInterface}>
          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              onPress={() => Alert.alert('Gallery', 'Choose image source', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Photo Library', onPress: handleGallery },
              ])} 
              style={[
                styles.galleryButton,
                activeButton === 'gallery' && styles.activeButton
              ]}
            >
              <ImageIcon style={[
                styles.galleryIcon,
                activeButton === 'gallery' && styles.activeIcon
              ]} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCameraButton}
              disabled={isCapturing || isProcessing}
              style={[
                styles.captureButton,
                isCapturing ? styles.recordingCapture : styles.pausedCapture,
                activeButton === 'camera' && styles.activeCaptureButton
              ]}
            >
              <Camera style={[
                styles.cameraControlIcon,
                activeButton === 'camera' && styles.activeIcon
              ]} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSavedPhotos} 
              style={[
                styles.focusButton,
                activeButton === 'saved' && styles.activeButton
              ]}
            >
              <Target style={[
                styles.focusIcon,
                activeButton === 'saved' && styles.activeIcon
              ]} />
            </TouchableOpacity>
          </View>

          {/* Saved Photos View */}
          {showSavedPhotos && (
            <View style={styles.galleryContainer}>
              <Text style={styles.sectionTitle}>Your Saved Scans</Text>
              {savedPhotos.length > 0 ? (
                <View style={styles.galleryGrid}>
                  {savedPhotos.map((photo) => (
                    <TouchableOpacity 
                      key={photo.id} 
                      style={styles.galleryItem}
                      onPress={async () => {
                        setCapturedImage(photo.uri);
                        setSelectedGalleryImage(photo.uri);
                        setShowSavedPhotos(false);
                        setActiveButton('camera');
                        await sendImageForDiagnosis(photo.uri);
                      }}
                    >
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.galleryImage} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No saved scans yet</Text>
              )}
            </View>
          )}

          {/* Live Camera View or Captured Image */}
          {!showSavedPhotos && (
            <View style={styles.cameraViewfinder}>
              {capturedImage ? (
                <View style={styles.capturedImageContainer}>
                  <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
                  <TouchableOpacity onPress={resetCapture} style={styles.retakeButton}>
                    <RotateCcw style={styles.retakeIcon} />
                    <Text style={styles.retakeText}>
                      {selectedGalleryImage ? 'Choose Again' : 'Retake'}
                    </Text>
                  </TouchableOpacity>
                  {selectedGalleryImage && (
                    <View style={styles.galleryBadge}>
                      <ImageIcon style={styles.galleryBadgeIcon} />
                      <Text style={styles.galleryBadgeText}>From Gallery</Text>
                    </View>
                  )}
                </View>
              ) : (
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                >
                  <View style={styles.cameraOverlay}>
                    <TouchableOpacity 
                      onPress={toggleCameraFacing} 
                      style={styles.flipButton}
                    >
                      <RotateCcw style={styles.flipIcon} />
                    </TouchableOpacity>
                    
                    <View style={styles.viewfinderOverlay}>
                      <View style={styles.scanFrame} />
                    </View>
                  </View>
                </CameraView>
              )}
            </View>
          )}

          <View style={styles.indicatorLine} />
        </View>

        {/* Instructions and Controls */}
        {!showSavedPhotos && (
          <View style={styles.instructionsAndControls}>
            <View style={styles.captureInstructions}>
              <Text style={styles.captureInstructionsText}>
                {getImageSourceInfo()}
              </Text>
              {!capturedImage && (
                <View style={styles.actionButtonsContainer}>
                  <Button
                    onPress={handleCameraButton}
                    disabled={isCapturing || isProcessing}
                    variant="primary"
                    style={[styles.actionButton, styles.captureActionButton]}
                  >
                    {isCapturing ? 'Capturing...' : 'Take Photo'}
                  </Button>
                  <Button
                    onPress={handleGallery}
                    disabled={isCapturing || isProcessing}
                    variant="secondary"
                    style={[styles.actionButton, styles.galleryActionButton]}
                  >
                    Choose from Gallery
                  </Button>
                </View>
              )}
            </View>

            {/* Processing Section */}
            {isProcessing && (
              <View style={styles.processingSection}>
                <View style={styles.processingTextContainer}>
                  <Text style={styles.processingText}>Processing...</Text>
                  <View style={styles.progressIndicator}>
                    <View
                      style={[
                        styles.progressIndicatorFilled,
                        { width: `${processingProgress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.analysisText}>{analysisText}</Text>
                </View>
              </View>
            )}

            {/* Results Section */}
            {showResults && diagnosisResult && (
              <View style={styles.resultsSection}>
                <View style={styles.resultContainer}>
                  <View style={styles.resultIconContainer}>
                    <AlertTriangle style={styles.resultIcon} />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultHeaderText}>{diagnosisResult.faultName}</Text>
                    <Text style={styles.resultSubtext}>Dashboard Warning</Text>
                  </View>
                </View>

                <View style={styles.explanationSection}>
                  <Text style={styles.explanationTitle}>Explanation</Text>
                  <Text style={styles.explanationText}>{diagnosisResult.explanation}</Text>
                </View>

                <View style={styles.recommendationSection}>
                  <Text style={styles.recommendationTitle}>Recommendation</Text>
                  <Text style={styles.recommendationText}>{diagnosisResult.recommendation}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  {diagnosisResult.videoUrl && (
                    <Button 
                      onPress={openVideoTutorial}
                      variant="primary" 
                      style={styles.getTutorialButton}
                    >
                      <ExternalLink style={styles.buttonIcon} />
                      Watch Tutorial
                    </Button>
                  )}
                  
                  <Button 
                    onPress={resetCapture}
                    variant="secondary" 
                    style={styles.scanAgainButton}
                  >
                    Scan Again
                  </Button>
                </View>
              </View>
            )}

            {/* Error Section */}
            {error && (
              <View style={styles.errorSection}>
                <Text style={styles.errorText}>{error}</Text>
                <Button 
                  onPress={resetCapture}
                  variant="secondary" 
                  style={styles.retryButton}
                >
                  Try Again
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  
  // Permission screens
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    color: '#5A7D28',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },

  // Camera interface
  cameraInterface: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 30,
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

  // Active button styles
  activeButton: {
    backgroundColor: '#D32F2F',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  activeCaptureButton: {
    backgroundColor: '#D32F2F',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  activeIcon: {
    color: '#FF4444',
  },

  // Camera viewfinder
  cameraViewfinder: {
    height: 400,
    backgroundColor: '#2C3A0F',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  flipIcon: {
    width: 20,
    height: 20,
    color: '#fff',
  },
  viewfinderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#5A7D28',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },

  // Captured image display
  capturedImageContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeIcon: {
    width: 16,
    height: 16,
    color: '#fff',
    marginRight: 4,
  },
  retakeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  galleryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 125, 40, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  galleryBadgeIcon: {
    width: 12,
    height: 12,
    color: '#fff',
    marginRight: 4,
  },
  galleryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
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

  // Instructions and controls
  instructionsAndControls: {
    padding: 16,
  },
  captureInstructions: {
    marginBottom: 16,
  },
  captureInstructionsText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
  captureActionButton: {
    backgroundColor: '#5A7D28',
  },
  galleryActionButton: {
    backgroundColor: '#3A4A1D',
    borderWidth: 1,
    borderColor: '#5A7D28',
  },

  // Processing section
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

  // Results section
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

  // Explanation section
  explanationSection: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A7D28',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },

  // Recommendation section
  recommendationSection: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A7D28',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },

  // Button container
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  getTutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A7D28',
    paddingVertical: 12,
  },
  scanAgainButton: {
    backgroundColor: '#3A4A1D',
    borderWidth: 1,
    borderColor: '#5A7D28',
    paddingVertical: 12,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    color: '#fff',
    marginRight: 8,
  },

  // Error section
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
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // Gallery sections
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