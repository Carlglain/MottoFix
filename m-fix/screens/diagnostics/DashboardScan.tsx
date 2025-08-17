import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, ImageIcon, Target, AlertTriangle, RotateCcw } from 'lucide-react-native';
import Button from '../../components/ui/button';
import DiagnosticResults from './DiagnosisResult'; // Import the DiagnosticResults component
import BottomNavigation from '../../navigation/BottomNavigation';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useAuth } from '../../services/context/AuthContext';

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
  const [capturedImage, setCapturedImage] = useState('');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState('');
  const [activeButton, setActiveButton] = useState('camera');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [savedPhotos] = useState([
    { id: 1, uri: 'https://example.com/photo1.jpg' },
    { id: 2, uri: 'https://example.com/photo2.jpg' },
  ]);

  const { user, loading } = useAuth();

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

  // API call to diagnose image with improved error handling
const diagnoseImage = async (base64Image) => {
  try {
    console.log('Starting API call to diagnose image...');
    
    const response = await axios.post('http://192.168.1.50:3000/diagnose/image', {
      userId: user.uid,
      vehicleId: "carModelX",
      inputData: base64Image
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 120000, // Increased to 120 seconds
    });

    console.log('API call successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling diagnosis API:', error);
    
    // More detailed error logging
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server took too long to respond');
      throw new Error('Request timeout - please try again');
    } else if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      if (error.response.status === 504) {
        throw new Error('Server timeout - the analysis is taking too long. Please try again.');
      } else if (error.response.status === 502) {
        throw new Error('Server temporarily unavailable. Please try again later.');
      } else if (error.response.status === 500) {
        throw new Error('Server error occurred during analysis. Please try again.');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('Unable to connect to server. Check your internet connection.');
    }
    
    throw error;
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

  // If loading or no user, show loading state or prompt to sign in
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.containerAuthMessage}>
         <TouchableOpacity onPress={()=>navigation.navigate('Login')}> 
          <Text style={styles.loadingText}>Please sign in to continue </Text> 
        </TouchableOpacity>
      </View>
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
      // Request media library permissions
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

      // Launch image picker
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
        console.log('Selected image:', selectedImage.uri);
        // Start processing the selected image
        await processSelectedImage(selectedImage.uri);
      } else {
        setActiveButton('camera');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to access photo library');
      setActiveButton('camera');
    }
  };

  // Updated processSelectedImage with better error handling
const processSelectedImage = async (imageUri) => {
  setIsProcessing(true);
  setAnalysisText('Converting image...');
  setProcessingProgress(10);

  try {
    // Convert image to base64
    setAnalysisText('Preparing image for analysis...');
    setProcessingProgress(30);
    const start = Date.now();
    const base64Image = await convertImageToBase64(imageUri);
    console.log("Base64 conversion took:", Date.now() - start, "ms");
    setAnalysisText('Sending to AI diagnostic service...');
    setProcessingProgress(50);
    
    // Call API with improved error handling
    const result = await diagnoseImage(base64Image);
    
    setAnalysisText('Processing diagnosis results...');
    setProcessingProgress(80);
    
    // Store the result
    setDiagnosisResult(result);
    
    setAnalysisText('Analysis complete!');
    setProcessingProgress(100);
    
    // Show results after a brief delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 500);
    
  } catch (error) {
    console.error('Error processing image:', error);
    setIsProcessing(false);
    setProcessingProgress(0);
    
    // More specific error messages
    let errorMessage = 'Failed to analyze the image. Please try again.';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.status === 504) {
      errorMessage = 'The server is taking too long to respond. Please try again later.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    Alert.alert(
      'Analysis Failed',
      errorMessage,
      [
        { text: 'OK' },
        { 
          text: 'Retry', 
          onPress: () => processSelectedImage(imageUri)
        }
      ]
    );
  }
};

  // Handle camera button - either capture or retake
  const handleCameraButton = async () => {
    // If there's a captured image, act as retake button
    if (capturedImage) {
      resetCapture();
      setActiveButton('camera');
      return;
    }

    // Otherwise, capture photo
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      setIsCapturing(true);
      setShowGallery(false);
      setShowSavedPhotos(false);
      setActiveButton('camera');

      // Take picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      setCapturedImage(photo.uri);
      setSelectedGalleryImage(null); // Clear any gallery selection
      
      // Start processing after capture animation
      setTimeout(async () => {
        setIsCapturing(false);
        await processSelectedImage(photo.uri);
      }, 1000);

    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image');
      setIsCapturing(false);
      setActiveButton('camera');
    }
  };

  // Show gallery options
  const showGalleryOptions = () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to select an image',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Photo Library', onPress: handleGallery },
        { text: 'Take Photo', onPress: () => {
          // Reset to camera mode
          setShowGallery(false);
          setShowSavedPhotos(false);
          setActiveButton('camera');
        }}
      ]
    );
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
              onPress={showGalleryOptions} 
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
                        await processSelectedImage(photo.uri);
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
                // Show captured image
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
                // Show live camera feed
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                >
                  {/* Camera overlay with flip button */}
                  <View style={styles.cameraOverlay}>
                    <TouchableOpacity 
                      onPress={toggleCameraFacing} 
                      style={styles.flipButton}
                    >
                      <RotateCcw style={styles.flipIcon} />
                    </TouchableOpacity>
                    
                    {/* Viewfinder overlay */}
                    <View style={styles.viewfinderOverlay}>
                      <View style={styles.scanFrame} />
                    </View>
                  </View>
                </CameraView>
              )}
            </View>
          )}

          {/* Green indicator line */}
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
            {showResults && diagnosisResult && (
              <View style={styles.resultsSection}>
                <View style={styles.resultContainer}>
                  <View style={styles.resultIconContainer}>
                    <AlertTriangle style={styles.resultIcon} />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultHeaderText}>
                      {diagnosisResult.diagnosis || 'Dashboard Light Analysis'}
                    </Text>
                    <Text style={styles.resultSubtext}>
                      {diagnosisResult.severity || 'Analysis Complete'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.resultDescription}>
                  {diagnosisResult.description || 
                   'The AI has analyzed your dashboard light. Check the detailed results for more information.'}
                </Text>

                {/* DiagnosticResults Component - Fixed to use diagnosisResult instead of response */}
                <DiagnosticResults 
                  route={{
                    params: {
                      diagnosis: diagnosisResult.result?.faultName || diagnosisResult.diagnosis || 'Dashboard Light Analysis',
                      severity: diagnosisResult.result?.severity || diagnosisResult.severity || 'critical',
                      description: diagnosisResult.result?.explanation || diagnosisResult.description || 'No description provided.',
                      costEstimate: diagnosisResult.result?.costEstimate || 'N/A',
                      videoTitle: 'Watch Repair Tutorial',
                      videoChannel: 'Auto Help Channel',
                      videoUrl: diagnosisResult.result?.videoUrl || '',
                      recommendation: diagnosisResult.result?.recommendation || diagnosisResult.recommendation || '',
                    }
                  }}
                  navigation={navigation}
                />

                
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
    paddingTop: 16,
  },
  containerAuthMessage: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for navbar
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
    backgroundColor: '#FF4444',
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