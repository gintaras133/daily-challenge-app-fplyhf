
import React, { useState } from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";

export default function RecordScreen() {
  // Sample challenge data - in a real app, this would come from navigation params or context
  const todayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "IKEA"
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Record Video",
          headerShown: false,
        }}
      />
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
                ios_icon_name="camera.fill"
                size={80} 
                color={colors.textOnPrimary}
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

          {/* Video Upload Section - Using Natively Upload Component */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>Upload Your Video</Text>
            <Text style={styles.uploadDescription}>
              Use the upload button below to select a video from your device.
              Videos should be under 60 seconds.
            </Text>
            
            {/* Natively Upload Component Placeholder */}
            {/* Note: The actual Upload component from Natively should be imported and used here */}
            {/* Example: <Upload storage="challengemedia" accept="video/*" style={styles.uploadButton} /> */}
            
            <View style={styles.uploadButton}>
              <IconSymbol 
                ios_icon_name="icloud.and.arrow.up.fill"
                size={32} 
                color={colors.textOnPrimary}
              />
              <Text style={styles.uploadButtonText}>
                Upload Video (Natively Component)
              </Text>
              <Text style={styles.uploadNote}>
                Storage: challengemedia
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={() => Alert.alert('Info', 'Video recording will be implemented with Natively Upload component')}
            >
              <Text style={styles.recordButtonText}>RECORD VIDEO</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadFromGalleryButton}
              onPress={() => Alert.alert('Info', 'Gallery upload will be implemented with Natively Upload component')}
            >
              <Text style={styles.uploadFromGalleryButtonText}>UPLOAD FROM GALLERY</Text>
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <View style={styles.tipSection}>
            <Text style={styles.tipText}>Tip: Vertical videos work best! 📱</Text>
          </View>
        </ScrollView>
      </View>
    </>
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
    paddingTop: 60,
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
    color: colors.textHeader,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
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
  uploadSection: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textHeader,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadNote: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
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
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  uploadFromGalleryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  uploadFromGalleryButtonText: {
    color: colors.textOnPrimary,
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
    color: colors.textMuted,
    textAlign: 'center',
  },
});
