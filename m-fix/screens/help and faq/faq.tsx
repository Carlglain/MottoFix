import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const faqs = [
  {
    question: "How to use the app?",
    answer: "Learn how to use the app to diagnose car problems.",
  },
  {
    question: "How can i Find a mechanic?",
    answer: "Find out how to locate and contact mechanics.",
  },
  {
    question: "What Services Does MottoFix Offer",
    answer: "Understand the different types of services available.",
  },
  {
    question: "What Are Some Common Car Problems?",
    answer: "Get help with common car issues and their solutions.",
  },
  {
    question: "What are some App features?",
    answer: "Learn about the app’s features and functionalities.",
  },
  {
    question: "Account settings!",
    answer: "Find out how to manage your account settings.",
  },
];

export default function FAQPage({ navigation }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
      </View>

      {/* FAQ Section */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Frequently Asked Questions</Text>

        {faqs.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.questionRow}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#fff"
                />
              </View>
              <Text style={styles.question}>{item.question}</Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C240F",
    paddingTop: StatusBar.currentHeight || 0, // ✅ fixes header hidden under status bar
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2E3A23",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2E3A23",
    paddingBottom: 10,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2E3A23",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  question: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  answer: {
    marginTop: 8,
    marginLeft: 42,
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
  },
});
