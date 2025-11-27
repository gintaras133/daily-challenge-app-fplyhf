
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import { useTask } from "@/contexts/TaskContext";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import * as FileSystem from 'expo-file-system/legacy';

export default function RecordScreen() {
  const { userProfile } = useAuth();
  const { todayTask } = useTask();
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideoToSupabase = async (uri: string, fileName: string) => {
    try {
      setIsUploading(true);
      console.log('=== Starting video upload ===');
      console.log('Video URI:', uri);
      console.log('File name:', fileName);
      console.log('Platform:', Platform.OS);

      if (!userProfile?.id) {
        console.error('No user profile found');
        throw new Error('User not authenticated');
      }

      console.log('User ID:', userProfile.id);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop() || 'mp4';
      const uniqueFileName = `${userProfile.id}_${timestamp}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      console.log('Unique filename:', uniqueFileName);

      let uploadData;
      let uploadError;

      // Different upload strategies for different platforms
      if (Platform.OS === 'web') {
        // Web: Use fetch and blob
        console.log('Using web upload strategy (fetch + blob)');
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log('Video blob size:', blob.size, 'bytes');
        console.log('Video blob type:', blob.type);

        const result = await supabase.storage
          .from('challengemedia')
          .upload(uniqueFileName, blob, {
            contentType: blob.type || 'video/mp4',
            upsert: false
          });
        
        uploadData = result.data;
        uploadError = result.error;
      } else {
        // Native (iOS/Android): Use FileSystem to read as base64 or binary
        console.log('Using native upload strategy (FileSystem)');
        
        try {
          // Try to get file info first
          const fileInfo = await FileSystem.getInfoAsync(uri);
          console.log('File info:', fileInfo);

          if (!fileInfo.exists) {
            throw new Error('File does not exist at URI');
          }

          // Read file as base64
          console.log('Reading file as base64...');
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          console.log('Base64 length:', base64.length);

          // Convert base64 to blob
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'video/mp4' });
          
          console.log('Converted to blob, size:', blob.size, 'bytes');

          const result = await supabase.storage
            .from('challengemedia')
            .upload(uniqueFileName, blob, {
              contentType: 'video/mp4',
              upsert: false
            });
          
          uploadData = result.data;
          uploadError = result.error;
        } catch (fsError) {
          console.error('FileSystem error:', fsError);
          // Fallback to fetch method
          console.log('Falling back to fetch method...');
          const response = await fetch(uri);
          const blob = await response.blob();
          console.log('Fallback blob size:', blob.size, 'bytes');

          const result = await supabase.storage
            .from('challengemedia')
            .upload(uniqueFileName, blob, {
              contentType: 'video/mp4',
              upsert: false
            });
          
          uploadData = result.data;
          uploadError = result.error;
        }
      }

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        console.error('Error details:', JSON.stringify(uploadError, null, 2));
        
        // Provide more specific error messages
        if (uploadError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please contact support.');
        } else if (uploadError.message?.includes('size')) {
          throw new Error('Video file is too large. Maximum size is 100MB.');
        } else if (uploadError.message?.includes('mime')) {
          throw new Error('Invalid video format. Please use MP4, MOV, or AVI.');
        }
        
        throw uploadError;
      }

      console.log('Upload successful! Storage data:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('challengemedia')
        .getPublicUrl(uniqueFileName);

      console.log('Public URL generated:', urlData.publicUrl);

      // Save video metadata to database
      console.log('Saving video metadata to user_videos table...');
      const videoData = {
        user_id: userProfile.id,
        video_url: urlData.publicUrl,
        file_name: uniqueFileName,
        title: `${todayTask.challenge} Challenge`,
        task: todayTask.challenge,
      };
      console.log('Video data to insert:', videoData);

      const { data: insertedData, error: dbError } = await supabase
        .from('user_videos')
        .insert(videoData)
        .select();

      if (dbError) {
        console.error('Database insert error:', dbError);
        console.error('Error details:', JSON.stringify(dbError, null, 2));
        throw dbError;
      }

      console.log('Video metadata saved successfully:', insertedData);
      console.log('=== Video upload complete ===');
      
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
      console.error('=== Video upload failed ===');
      console.error('Error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Upload Failed', 
        `Failed to upload video: ${errorMessage}. Please try again.`
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordVideo = async () => {
    try {
      console.log('=== Starting video recording ===');
      
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to record videos.');
        return;
      }

      // Launch camera for video recording
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 60 seconds max
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const fileName = result.assets[0].fileName || `recorded_${Date.now()}.mp4`;
        console.log('Video recorded, URI:', videoUri);
        console.log('File name:', fileName);
        
        // Automatically upload to Library
        await uploadVideoToSupabase(videoUri, fileName);
      } else {
        console.log('Video recording cancelled');
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const handleUploadFromGallery = async () => {
    try {
      console.log('=== Starting gallery upload ===');
      
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is needed to select videos.');
        return;
      }

      // Launch image picker for video selection
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 60 seconds max
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const fileName = result.assets[0].fileName || `upload_${Date.now()}.mp4`;
        console.log('Video selected, URI:', videoUri);
        console.log('File name:', fileName);
        
        // Automatically upload to Library
        await uploadVideoToSupabase(videoUri, fileName);
      } else {
        console.log('Video selection cancelled');
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
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
              color={colors.textOnPrimary}
            />
          </View>
        </View>

        {/* Today's Challenge Card */}
        <View style={styles.challengeCardContainer}>
          <TodaysChallengeCard
            challenge={todayTask.challenge}
            guidelines={todayTask.guidelines}
            conqueredFear={todayTask.conqueredFear}
            duration={todayTask.duration}
            reward={todayTask.reward}
            partner={todayTask.partner}
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
              android_material_icon_name="videocam" 
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
              android_material_icon_name="photo-library" 
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
