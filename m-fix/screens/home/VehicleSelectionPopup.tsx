import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Mock data - replace with actual API calls
const mockVehicles = [
  {
    id: '1',
    make: 'Honda',
    model: 'Civic',
    year: '2021',
    color: 'Blue',
    plateNumber: 'ABC-123',
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    color: 'Silver',
    plateNumber: 'XYZ-789',
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: '2022',
    color: 'Red',
    plateNumber: 'DEF-456',
  },
];

// Vehicle creation form component
const CreateVehicleForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plateNumber: '',
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.make || !formData.model || !formData.year) {
      Alert.alert('Error', 'Please fill in Make, Model, and Year fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.createVehicleForm}>
      <Text style={styles.formTitle}>Add New Vehicle</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Make *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.make}
          onChangeText={(text) => setFormData({ ...formData, make: text })}
          placeholder="e.g., Honda, Toyota, Ford"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Model *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.model}
          onChangeText={(text) => setFormData({ ...formData, model: text })}
          placeholder="e.g., Civic, Camry, F-150"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Year *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.year}
            onChangeText={(text) => setFormData({ ...formData, year: text })}
            placeholder="2020"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Color</Text>
          <TextInput
            style={styles.textInput}
            value={formData.color}
            onChangeText={(text) => setFormData({ ...formData, color: text })}
            placeholder="Blue"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Plate Number</Text>
        <TextInput
          style={styles.textInput}
          value={formData.plateNumber}
          onChangeText={(text) => setFormData({ ...formData, plateNumber: text.toUpperCase() })}
          placeholder="ABC-123"
          placeholderTextColor="#888"
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.formButton, styles.cancelButton]} 
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.formButton, styles.submitButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.submitButtonText}>Add Vehicle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Main popup component
const VehicleSelectionPopup = ({ 
  visible, 
  onClose, 
  onVehicleSelect, 
  actionType // 'scan' or 'record'
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Load vehicles when popup opens
  useEffect(() => {
    if (visible) {
      loadVehicles();
    }
  }, [visible]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setVehicles(mockVehicles);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirmSelection = () => {
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }
    
    onVehicleSelect(selectedVehicle, actionType);
    onClose();
    resetState();
  };

  const handleCreateVehicle = async (vehicleData) => {
    setLoading(true);
    try {
      // Simulate API call to create vehicle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData,
      };
      
      setVehicles([...vehicles, newVehicle]);
      setSelectedVehicle(newVehicle);
      setShowCreateForm(false);
      
      Alert.alert('Success', 'Vehicle added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedVehicle(null);
    setShowCreateForm(false);
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const getActionTitle = () => {
    return actionType === 'scan' ? 'Scan Dashboard' : 'Record Sound';
  };

  const getActionIcon = () => {
    return actionType === 'scan' ? 'camera-outline' : 'mic-outline';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name={getActionIcon()} size={24} color="#7ce216" />
              <Text style={styles.modalTitle}>{getActionTitle()}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.modalContent} 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {showCreateForm ? (
              <CreateVehicleForm
                onSubmit={handleCreateVehicle}
                onCancel={() => setShowCreateForm(false)}
                loading={loading}
              />
            ) : (
              <>
                <Text style={styles.subtitle}>Select a vehicle to continue</Text>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7ce216" />
                    <Text style={styles.loadingText}>Loading vehicles...</Text>
                  </View>
                ) : (
                  <>
                    {/* Vehicle List */}
                    <ScrollView style={styles.vehicleList} showsVerticalScrollIndicator={false}>
                      {vehicles.map((vehicle) => (
                        <TouchableOpacity
                          key={vehicle.id}
                          style={[
                            styles.vehicleItem,
                            selectedVehicle?.id === vehicle.id && styles.selectedVehicleItem
                          ]}
                          onPress={() => handleVehicleSelect(vehicle)}
                        >
                          <View style={styles.vehicleIcon}>
                            <Ionicons name="car-outline" size={24} color="#7ce216" />
                          </View>
                          
                          <View style={styles.vehicleInfo}>
                            <Text style={styles.vehicleName}>
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </Text>
                            <View style={styles.vehicleDetails}>
                              {vehicle.color && (
                                <Text style={styles.vehicleDetail}>{vehicle.color}</Text>
                              )}
                              {vehicle.plateNumber && (
                                <Text style={styles.vehicleDetail}>• {vehicle.plateNumber}</Text>
                              )}
                            </View>
                          </View>

                          {selectedVehicle?.id === vehicle.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#7ce216" />
                          )}
                        </TouchableOpacity>
                      ))}

                      {/* Add New Vehicle Button */}
                      <TouchableOpacity
                        style={styles.addVehicleButton}
                        onPress={() => setShowCreateForm(true)}
                      >
                        <View style={styles.addVehicleIcon}>
                          <Ionicons name="add-circle-outline" size={24} color="#7ce216" />
                        </View>
                        <Text style={styles.addVehicleText}>Add New Vehicle</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.cancelActionButton}
                        onPress={handleClose}
                      >
                        <Text style={styles.cancelActionText}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          !selectedVehicle && styles.confirmButtonDisabled
                        ]}
                        onPress={handleConfirmSelection}
                        disabled={!selectedVehicle}
                      >
                        <Ionicons name={getActionIcon()} size={20} color="#000" />
                        <Text style={styles.confirmButtonText}>
                          {actionType === 'scan' ? 'Start Scan' : 'Start Recording'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
              )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  
  modalContainer: {
    backgroundColor: '#111',
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flexGrow: 1,
  },
  
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },

  // Vehicle List
  vehicleList: {
    flex: 1,
    marginBottom: 20,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVehicleItem: {
    borderColor: '#7ce216',
    backgroundColor: '#1a2e0a',
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleDetail: {
    color: '#999',
    fontSize: 14,
    marginRight: 8,
  },

  // Add Vehicle Button
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2e0a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7ce216',
    borderStyle: 'dashed',
  },
  addVehicleIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addVehicleText: {
    color: '#7ce216',
    fontSize: 16,
    fontWeight: '600',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelActionButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#7ce216',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Create Vehicle Form
  createVehicleForm: {
    flex: 1,
  },
  formTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#7ce216',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleSelectionPopup;