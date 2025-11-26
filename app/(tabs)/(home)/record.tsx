
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import TodaysChallengeCard from "@/components/TodaysChallengeCard";

export default function RecordScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Sample challenge data - in a real app, this would come from navigation params or context
  const todayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "IKEA"
  };

  const handleRecordVideo = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to record videos.');
        return;
      }

      // Launch camera for video recording
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Video recorded:', result.assets[0].uri);
        // Handle the recorded video here
        Alert.alert('Success', 'Video recorded successfully!');
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const handleUploadFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is needed to upload videos.');
        return;
      }

      // Launch image picker for videos
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Video selected:', result.assets[0].uri);
        // Handle the selected video here
        Alert.alert('Success', 'Video uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>FILM YOUR VIDEO</Text>
          <Text style={styles.subtitle}>Make it creative!</Text>
        </View>

        {/* Camera Circle */}
        <View style={styles.cameraSection}>
          <View style={styles.cameraCircle}>
            <IconSymbol 
              android_material_icon_name="photo-camera" 
              size={80} 
              color="#ffffff"
            />
          </View>
        </View>

        {/* Today's Challenge Card */}
        <View style={styles.challengeCardContainer}>
          <TodaysChallengeCard
            challenge={todayChallenge.challenge}
            environment={todayChallenge.environment}
            phrase={todayChallenge.phrase}
            partner={todayChallenge.partner}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={handleRecordVideo}
          >
            <Text style={styles.recordButtonText}>RECORD VIDEO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadFromGallery}
          >
            <Text style={styles.uploadButtonText}>UPLOAD FROM GALLERY</Text>
          </TouchableOpacity>
        </View>

        {/* Tip */}
        <View style={styles.tipSection}>
          <Text style={styles.tipText}>Tip: Vertical videos work best! 📱</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textLight,
  },
  cameraSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cameraCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(194, 226, 250, 0.4)',
    elevation: 8,
  },
  challengeCardContainer: {
    marginBottom: 32,
  },
  buttonSection: {
    gap: 16,
    marginBottom: 24,
  },
  recordButton: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(183, 163, 227, 0.3)',
    elevation: 4,
  },
  recordButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  uploadButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tipSection: {
    alignItems: 'center',
  },
  tipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
  },
});
