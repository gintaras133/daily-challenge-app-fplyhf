
import React, { useState } from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function RecordScreen() {
  const { userProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Sample challenge data - in a real app, this would come from navigation params or context
  const todayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "IKEA"
  };

  const uploadVideoToSupabase = async (uri: string, fileName: string) => {
    try {
      setIsUploading(true);

      // Fetch the video file
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${userProfile?.id}_${timestamp}_${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('challengemedia')
        .upload(uniqueFileName, blob, {
          contentType: 'video/mp4',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('challengemedia')
        .getPublicUrl(uniqueFileName);

      console.log('Video uploaded successfully:', urlData.publicUrl);
      
      Alert.alert(
        'Success!',
        'Your video has been uploaded to your Library!',
        [
          {
            text: 'View Library',
            onPress: () => router.push('/(tabs)/library')
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Upload Failed', 'Failed to upload video. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
    }
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
        const videoUri = result.assets[0].uri;
        const fileName = `recorded_${Date.now()}.mp4`;
        
        // Automatically upload to Library
        await uploadVideoToSupabase(videoUri, fileName);
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
        Alert.alert('Permission Required', 'Media library permission is needed to select videos.');
        return;
      }

      // Launch image picker for video selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const fileName = result.assets[0].fileName || `upload_${Date.now()}.mp4`;
        
        // Automatically upload to Library
        await uploadVideoToSupabase(videoUri, fileName);
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
    }
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

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={handleRecordVideo}
              disabled={isUploading}
            >
              <IconSymbol 
                ios_icon_name="video.fill"
                size={24} 
                color={colors.textOnPrimary}
              />
              <Text style={styles.recordButtonText}>
                {isUploading ? 'UPLOADING...' : 'RECORD VIDEO'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadFromGalleryButton}
              onPress={handleUploadFromGallery}
              disabled={isUploading}
            >
              <IconSymbol 
                ios_icon_name="photo.on.rectangle"
                size={24} 
                color={colors.textOnPrimary}
              />
              <Text style={styles.uploadFromGalleryButtonText}>
                {isUploading ? 'UPLOADING...' : 'UPLOAD FROM GALLERY'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <View style={styles.tipSection}>
            <Text style={styles.tipText}>Tip: Vertical videos work best! 📱</Text>
            <Text style={styles.tipSubtext}>Videos will be automatically added to your Library</Text>
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
  buttonSection: {
    gap: 16,
    marginBottom: 24,
  },
  recordButton: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
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
    gap: 8,
  },
  tipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
  },
  tipSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
