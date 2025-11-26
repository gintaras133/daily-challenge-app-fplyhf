
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/app/integrations/supabase/client';

export default function ProfileScreen() {
  const { user, userProfile, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [age, setAge] = useState(userProfile?.age?.toString() || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [town, setTown] = useState(userProfile?.town || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.telephone_number || '');
  const [facebookUrl, setFacebookUrl] = useState(userProfile?.facebook_url || '');
  const [instagramUrl, setInstagramUrl] = useState(userProfile?.instagram_url || '');
  const [tiktokUrl, setTiktokUrl] = useState(userProfile?.tiktok_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedin_url || '');
  const [usernameError, setUsernameError] = useState('');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const checkUsernameAvailability = async (newUsername: string) => {
    if (newUsername === userProfile?.username) {
      setUsernameError('');
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', newUsername)
        .single();

      if (data) {
        setUsernameError('Username already taken');
        return false;
      }
      
      setUsernameError('');
      return true;
    } catch (error) {
      console.log('Username available');
      setUsernameError('');
      return true;
    }
  };

  const handleUsernameChange = async (text: string) => {
    setUsername(text);
    if (text.length >= 3) {
      await checkUsernameAvailability(text);
    }
  };

  const handleSave = async () => {
    if (!userProfile) return;

    // Validate username
    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      Alert.alert('Error', 'Username already taken. Please choose another one.');
      return;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13) {
      Alert.alert('Error', 'You must be at least 13 years old');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          username: username,
          age: ageNum,
          country: country,
          town: town,
          telephone_number: phoneNumber,
          facebook_url: facebookUrl || null,
          instagram_url: instagramUrl || null,
          tiktok_url: tiktokUrl || null,
          linkedin_url: linkedinUrl || null,
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(userProfile?.full_name || '');
    setUsername(userProfile?.username || '');
    setAge(userProfile?.age?.toString() || '');
    setCountry(userProfile?.country || '');
    setTown(userProfile?.town || '');
    setPhoneNumber(userProfile?.telephone_number || '');
    setFacebookUrl(userProfile?.facebook_url || '');
    setInstagramUrl(userProfile?.instagram_url || '');
    setTiktokUrl(userProfile?.tiktok_url || '');
    setLinkedinUrl(userProfile?.linkedin_url || '');
    setUsernameError('');
    setIsEditing(false);
  };

  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is needed to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingPhoto(true);
        
        // In a real app, you would upload to Supabase Storage here
        // For now, we'll just update the URL in the database
        const photoUri = result.assets[0].uri;
        
        // TODO: Upload to Supabase Storage
        // const { data, error } = await supabase.storage
        //   .from('profile-photos')
        //   .upload(`${userProfile?.id}/avatar.jpg`, photoFile);
        
        // For now, just save the local URI
        const { error } = await supabase
          .from('user_profiles')
          .update({ profile_photo_url: photoUri })
          .eq('id', userProfile?.id);

        if (error) throw error;

        await refreshProfile();
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol 
            android_material_icon_name="arrow-back" 
            size={24} 
            color="#000000"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {userProfile?.profile_photo_url ? (
              <Image 
                source={{ uri: userProfile.profile_photo_url }} 
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol 
                  android_material_icon_name="person" 
                  size={60} 
                  color={colors.text}
                />
              </View>
            )}
            {isUploadingPhoto && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={handleUploadPhoto}
            disabled={isUploadingPhoto}
          >
            <Text style={styles.changePhotoText}>
              {userProfile?.profile_photo_url ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <IconSymbol 
                  android_material_icon_name="edit" 
                  size={24} 
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={colors.text}
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile?.full_name}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            {isEditing ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, usernameError ? styles.inputError : null]}
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="Enter username"
                  placeholderTextColor={colors.text}
                  autoCapitalize="none"
                />
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : null}
              </View>
            ) : (
              <Text style={styles.infoValue}>@{userProfile?.username}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
                placeholderTextColor={colors.text}
                keyboardType="number-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile?.age}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter country"
                placeholderTextColor={colors.text}
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile?.country}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Town</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={town}
                onChangeText={setTown}
                placeholder="Enter town"
                placeholderTextColor={colors.text}
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile?.town}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile?.telephone_number}</Text>
            )}
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          <View style={styles.socialRow}>
            <View style={styles.socialIconContainer}>
              <IconSymbol 
                android_material_icon_name="facebook" 
                size={24} 
                color="#1877F2"
              />
              <Text style={styles.socialLabel}>Facebook</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.socialInput}
                value={facebookUrl}
                onChangeText={setFacebookUrl}
                placeholder="Facebook profile URL"
                placeholderTextColor={colors.text}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.socialValue}>
                {userProfile?.facebook_url || 'Not connected'}
              </Text>
            )}
          </View>

          <View style={styles.socialRow}>
            <View style={styles.socialIconContainer}>
              <IconSymbol 
                android_material_icon_name="camera" 
                size={24} 
                color="#E4405F"
              />
              <Text style={styles.socialLabel}>Instagram</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.socialInput}
                value={instagramUrl}
                onChangeText={setInstagramUrl}
                placeholder="Instagram profile URL"
                placeholderTextColor={colors.text}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.socialValue}>
                {userProfile?.instagram_url || 'Not connected'}
              </Text>
            )}
          </View>

          <View style={styles.socialRow}>
            <View style={styles.socialIconContainer}>
              <IconSymbol 
                android_material_icon_name="music-note" 
                size={24} 
                color="#000000"
              />
              <Text style={styles.socialLabel}>TikTok</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.socialInput}
                value={tiktokUrl}
                onChangeText={setTiktokUrl}
                placeholder="TikTok profile URL"
                placeholderTextColor={colors.text}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.socialValue}>
                {userProfile?.tiktok_url || 'Not connected'}
              </Text>
            )}
          </View>

          <View style={styles.socialRow}>
            <View style={styles.socialIconContainer}>
              <IconSymbol 
                android_material_icon_name="work" 
                size={24} 
                color="#0A66C2"
              />
              <Text style={styles.socialLabel}>LinkedIn</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.socialInput}
                value={linkedinUrl}
                onChangeText={setLinkedinUrl}
                placeholder="LinkedIn profile URL"
                placeholderTextColor={colors.text}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.socialValue}>
                {userProfile?.linkedin_url || 'Not connected'}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving || !!usernameError}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  changePhotoText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: colors.secondary,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  socialRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  socialIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  socialValue: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  socialInput: {
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.secondary,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
