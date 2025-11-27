
import React, { useState, useEffect } from 'react';
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
import CountryPicker, { Country, COUNTRIES } from '@/components/CountryPicker';
import PhoneInput from '@/components/PhoneInput';
import InviteUserModal from '@/components/InviteUserModal';

export default function ProfileScreen() {
  const { user, userProfile, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [age, setAge] = useState(userProfile?.age?.toString() || '');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [town, setTown] = useState(userProfile?.town || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [facebookUrl, setFacebookUrl] = useState(userProfile?.facebook_url || '');
  const [instagramUrl, setInstagramUrl] = useState(userProfile?.instagram_url || '');
  const [tiktokUrl, setTiktokUrl] = useState(userProfile?.tiktok_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedin_url || '');
  const [usernameError, setUsernameError] = useState('');

  // Initialize country and phone from profile
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setUsername(userProfile.username || '');
      setAge(userProfile.age?.toString() || '');
      setTown(userProfile.town || '');
      setFacebookUrl(userProfile.facebook_url || '');
      setInstagramUrl(userProfile.instagram_url || '');
      setTiktokUrl(userProfile.tiktok_url || '');
      setLinkedinUrl(userProfile.linkedin_url || '');

      // Parse country from profile
      const country = COUNTRIES.find(c => c.name === userProfile.country);
      setSelectedCountry(country || null);

      // Parse phone number (remove country code)
      if (userProfile.telephone_number && country) {
        const phoneWithoutCode = userProfile.telephone_number
          .replace(country.dialCode, '')
          .trim();
        setPhoneNumber(phoneWithoutCode);
      } else {
        setPhoneNumber(userProfile.telephone_number || '');
      }
    }
  }, [userProfile]);

  const handleSignIn = () => {
    console.log('Navigate to sign in');
    router.push('/auth/login');
  };

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
            console.log('User confirmed sign out');
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user) {
      Alert.alert('Error', 'No user found');
      return;
    }

    setIsDeleting(true);

    try {
      console.log('Calling delete-user-account Edge Function for user:', user.id);

      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the Edge Function to delete the account
      const { data, error } = await supabase.functions.invoke('delete-user-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Account deletion response:', data);

      // Sign out the user
      await signOut();
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error deleting account:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to delete account. Please try again or contact support.'
      );
    } finally {
      setIsDeleting(false);
    }
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

    // Validate country
    if (!selectedCountry) {
      Alert.alert('Error', 'Please select a country');
      return;
    }

    // Validate phone
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setIsSaving(true);

    try {
      const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber}`;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          username: username,
          age: ageNum,
          country: selectedCountry.name,
          town: town,
          telephone_number: fullPhoneNumber,
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
    setTown(userProfile?.town || '');
    setFacebookUrl(userProfile?.facebook_url || '');
    setInstagramUrl(userProfile?.instagram_url || '');
    setTiktokUrl(userProfile?.tiktok_url || '');
    setLinkedinUrl(userProfile?.linkedin_url || '');
    
    // Reset country and phone
    const country = COUNTRIES.find(c => c.name === userProfile?.country);
    setSelectedCountry(country || null);
    if (userProfile?.telephone_number && country) {
      const phoneWithoutCode = userProfile.telephone_number
        .replace(country.dialCode, '')
        .trim();
      setPhoneNumber(phoneWithoutCode);
    } else {
      setPhoneNumber(userProfile?.telephone_number || '');
    }
    
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
        
        const photoUri = result.assets[0].uri;
        
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

  // If user is not logged in, show sign-in prompt
  if (!user) {
    return (
      <View style={styles.container}>
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
        <View style={styles.signInPrompt}>
          <IconSymbol 
            android_material_icon_name="account-circle" 
            size={80} 
            color={colors.text}
          />
          <Text style={styles.signInTitle}>Sign In Required</Text>
          <Text style={styles.signInText}>
            Please sign in to access your profile and settings.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
              <CountryPicker
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
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
              <PhoneInput
                country={selectedCountry}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
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
          <>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => {
                console.log('Opening invite modal');
                setShowInviteModal(true);
              }}
            >
              <IconSymbol 
                android_material_icon_name="person-add" 
                size={20} 
                color={colors.text}
              />
              <Text style={styles.inviteButtonText}>Invite New User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <IconSymbol 
                    android_material_icon_name="delete-forever" 
                    size={20} 
                    color="#ffffff"
                  />
                  <Text style={styles.deleteAccountButtonText}>Delete My Account</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <InviteUserModal
        visible={showInviteModal}
        onClose={() => {
          console.log('Closing invite modal');
          setShowInviteModal(false);
        }}
      />
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
  signInPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 20,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  signInText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  signInButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
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
    marginBottom: 16,
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
  inviteButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  inviteButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteAccountButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  deleteAccountButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
