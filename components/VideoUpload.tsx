
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

/**
 * VideoUpload Component
 * 
 * This component is a placeholder for the Natively Upload component.
 * 
 * To use the actual Natively Upload component:
 * 1. Import the Upload component from Natively
 * 2. Replace this component with:
 *    <Upload
 *      storage="challengemedia"
 *      accept="video/*"
 *      style={{
 *        backgroundColor: colors.primary,
 *        padding: 16,
 *        borderRadius: 12
 *      }}
 *    />
 * 
 * 3. Ensure the Supabase storage bucket "challengemedia" exists with:
 *    - Public access enabled
 *    - Uploads allowed
 *    - Video MIME types allowed
 */

interface VideoUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

export default function VideoUpload({ onUploadComplete, onUploadError }: VideoUploadProps) {
  const handleUpload = () => {
    Alert.alert(
      'Natively Upload Component',
      'To enable video uploads:\n\n' +
      '1. Use the Natively Upload component\n' +
      '2. Set storage="challengemedia"\n' +
      '3. Set accept="video/*"\n' +
      '4. Ensure the Supabase bucket exists\n\n' +
      'See VideoUpload.tsx for implementation details.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <IconSymbol 
          android_material_icon_name="cloud-upload"
          ios_icon_name="icloud.and.arrow.up.fill"
          size={40} 
          color={colors.textOnPrimary}
        />
        <Text style={styles.uploadButtonText}>Upload Video</Text>
        <Text style={styles.uploadNote}>Tap to select video from device</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Upload Requirements:</Text>
        <Text style={styles.infoText}>• Video format: MP4, MOV, AVI</Text>
        <Text style={styles.infoText}>• Max duration: 60 seconds</Text>
        <Text style={styles.infoText}>• Vertical orientation recommended</Text>
        <Text style={styles.infoText}>• Storage: challengemedia bucket</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  uploadButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  uploadButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  uploadNote: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textHeader,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
});
