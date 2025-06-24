import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const dummyNotifications = [
  {
    id: '1',
    title: 'Oil Change Reminder',
    summary: 'Time for your routine oil change.',
    details: 'It has been 6 months or 5000km since your last oil change. Keeping fresh oil ensures your engine stays healthy and performs well.',
  },
  {
    id: '2',
    title: 'Low Tire Pressure',
    summary: 'Check your front-left tire pressure.',
    details: 'Your front-left tire is below recommended pressure. Low tire pressure can cause reduced fuel efficiency and uneven wear.',
  },
  {
    id: '3',
    title: 'Battery Health Check',
    summary: 'Your battery might need service soon.',
    details: 'Recent diagnostics suggest your battery is nearing the end of its lifespan. Consider replacing it to avoid breakdowns.',
  },
];

export default function NotificationsScreen({ navigation }) {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
  };

  const closePopup = () => {
    setSelectedNotification(null);
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Notifications</Text>

      <ScrollView>
        {dummyNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationBox}
            onPress={() => handleNotificationPress(notification)}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationSummary}>{notification.summary}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🪟 Detailed Info Popup */}
      <Modal
        visible={!!selectedNotification}
        animationType="slide"
        transparent={true}
        onRequestClose={closePopup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>{selectedNotification?.title}</Text>
            <Text style={styles.popupDetail}>{selectedNotification?.details}</Text>

            <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 🟢 Floating Back Button */}
        <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => navigation.goBack()}
        >
        <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    floatingBackButton: {
        position: 'absolute',
        bottom: 80, // Not too close to the edge
        right: 20,
        backgroundColor: '#7ce216',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10, // Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },      
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
      paddingTop: 50,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backText: {
      color: '#fff',
      marginLeft: 6,
      fontSize: 16,
    },
    header: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    notificationBox: {
      backgroundColor: '#1a1a1a',
      padding: 15,
      marginBottom: 12,
      borderRadius: 8,
    },
    notificationTitle: {
      color: '#7ce216',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
    },
    notificationSummary: {
      color: '#ccc',
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    popupBox: {
      backgroundColor: '#1f2b1a',
      padding: 20,
      borderRadius: 10,
      width: '100%',
    },
    popupTitle: {
      color: '#7ce216',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    popupDetail: {
      color: '#ccc',
      fontSize: 15,
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: '#7ce216',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#000',
      fontWeight: 'bold',
    },
  });