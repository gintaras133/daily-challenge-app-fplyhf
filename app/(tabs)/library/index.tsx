
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

export default function LibraryScreen() {
  const { userProfile } = useAuth();

  // Sample saved videos data
  const savedVideos = [
    {
      id: '1',
      username: '@sarah_adventures',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      timeAgo: '2 days ago',
      likes: 234,
    },
    {
      id: '2',
      username: '@mike_creates',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      timeAgo: '5 days ago',
      likes: 567,
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Extract phone number without country code
  const getPhoneWithoutCountryCode = (fullPhone: string | null | undefined) => {
    if (!fullPhone) return 'Not set';
    
    // Remove common country code patterns like +1, +44, etc.
    const phoneWithoutCode = fullPhone.replace(/^\+?\d{1,4}\s*/, '').trim();
    return phoneWithoutCode || fullPhone;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Library</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/(tabs)/library/profile')}
            >
              <IconSymbol 
                android_material_icon_name="settings" 
                size={24} 
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
        {userProfile && (
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>
              Welcome, {userProfile.full_name}!
            </Text>
            <View style={styles.infoRow}>
              <IconSymbol 
                android_material_icon_name="location-on" 
                size={16} 
                color={colors.text}
              />
              <Text style={styles.infoText}>{userProfile.country}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol 
                android_material_icon_name="phone" 
                size={16} 
                color={colors.text}
              />
              <Text style={styles.infoText}>
                {getPhoneWithoutCountryCode(userProfile.telephone_number)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Videos</Text>
          {savedVideos.length > 0 ? (
            savedVideos.map((video, index) => (
              <View key={index} style={styles.videoCard}>
                <View style={styles.videoThumbnail}>
                  <Text style={styles.videoPlaceholder}>Video</Text>
                </View>
                <View style={styles.videoInfo}>
                  <Image 
                    source={{ uri: video.avatarUrl }} 
                    style={styles.avatar}
                  />
                  <View style={styles.videoDetails}>
                    <Text style={styles.username}>{video.username}</Text>
                    <Text style={styles.timeAgo}>{video.timeAgo}</Text>
                  </View>
                  <View style={styles.likesContainer}>
                    <IconSymbol 
                      android_material_icon_name="favorite" 
                      size={16} 
                      color={colors.accent}
                    />
                    <Text style={styles.likesText}>{video.likes}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No videos yet. Start participating in challenges!
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.communityButton}
          onPress={() => router.push('/(tabs)/community')}
        >
          <Text style={styles.communityButtonText}>Back to Community Hub</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: colors.textOnSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    gap: 6,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textHeader,
    marginBottom: 12,
  },
  videoCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
  },
  videoDetails: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '400',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  communityButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  communityButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
