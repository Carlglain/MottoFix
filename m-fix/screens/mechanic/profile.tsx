import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper"; // install react-native-paper

export default function MechanicProfile() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerText}>Mechanic Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/219/219983.png" }} // placeholder avatar
          style={styles.avatar}
        />
        <Text style={styles.name}>Alex Turner</Text>
        <Text style={styles.subTitle}>Certified Mechanic</Text>
        <Text style={styles.experience}>5 years of experience</Text>
        <Text style={styles.description}>
          Alex is a certified mechanic with 5 years of experience specializing in engine diagnostics and
          repair. He is known for his meticulous approach and commitment to customer satisfaction.
        </Text>
      </View>

      {/* Location */}
      <View style={styles.infoRow}>
        <Ionicons name="location-sharp" size={22} color="#fff" />
        <Text style={styles.infoText}>123 Main Street, Anytown</Text>
      </View>

      {/* Contact */}
      <View style={styles.infoRow}>
        <Ionicons name="call" size={22} color="#fff" />
        <Text style={styles.infoText}>+1 (555) 123-4567</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="email" size={22} color="#fff" />
        <Text style={styles.infoText}>alex.turner@email.com</Text>
      </View>

      {/* Ratings */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Ratings</Text>
        <View style={styles.ratingSummary}>
          <Text style={styles.ratingValue}>4.8</Text>
          <Ionicons name="star" size={22} color="#FFD700" />
          <Text style={styles.reviews}>125 reviews</Text>
        </View>

        {/* Rating Bars */}
        {[
          { stars: 5, percent: 0.7 },
          { stars: 4, percent: 0.2 },
          { stars: 3, percent: 0.05 },
          { stars: 2, percent: 0.03 },
          { stars: 1, percent: 0.02 },
        ].map((item, index) => (
          <View key={index} style={styles.progressRow}>
            <Text style={styles.stars}>{item.stars}</Text>
            <ProgressBar progress={item.percent} color="#4CAF50" style={styles.progressBar} />
            <Text style={styles.percent}>{Math.round(item.percent * 100)}%</Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Rate Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2E1C", // dark green background
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subTitle: { color: "#A8D5BA", fontSize: 16 },
  experience: { color: "#ccc", fontSize: 14, marginBottom: 10 },
  description: { color: "#ddd", textAlign: "center", lineHeight: 20 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: { color: "#fff", marginLeft: 10, fontSize: 15 },
  ratingSection: { marginTop: 20 },
  ratingTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 10 },
  ratingSummary: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  ratingValue: { color: "#fff", fontSize: 32, fontWeight: "bold", marginRight: 5 },
  reviews: { color: "#ccc", marginLeft: 10 },
  progressRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  stars: { color: "#fff", width: 20 },
  progressBar: { flex: 1, height: 8, borderRadius: 5, marginHorizontal: 10 },
  percent: { color: "#fff", width: 40, textAlign: "right" },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
