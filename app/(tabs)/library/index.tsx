
import React, { useState } from 'react';
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
import VideoComparisonModal from '@/components/VideoComparisonModal';

export default function LibraryScreen() {
  const { userProfile } = useAuth();
  const [clickedVideos, setClickedVideos] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [currentComparisonPair, setCurrentComparisonPair] = useState<number>(0);

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

  // Additional video pairs for the comparison modal
  const comparisonPairs = [
    {
      video1: {
        id: '3',
        username: '@library_user_a',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      },
      video2: {
        id: '4',
        username: '@library_user_b',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      },
    },
    {
      video1: {
        id: '5',
        username: '@library_user_c',
        avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      },
      video2: {
        id: '6',
        username: '@library_user_d',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
      },
    },
  ];

  const handleVideoClick = (videoId: string) => {
    console.log('Library video clicked:', videoId);
    
    // Add to clicked videos if not already clicked
    if (!clickedVideos.includes(videoId)) {
      const newClickedVideos = [...clickedVideos, videoId];
      setClickedVideos(newClickedVideos);
      
      // Show comparison modal after 1 or 2 videos are clicked
      if (newClickedVideos.length === 1 || newClickedVideos.length === 2) {
        setShowComparisonModal(true);
      }
    }
  };

  const handleComparisonVote = (videoId: string | 'neither') => {
    console.log('Comparison vote:', videoId);
    
    // Move to next comparison pair if available
    if (currentComparisonPair < comparisonPairs.length - 1) {
      setCurrentComparisonPair(currentComparisonPair + 1);
      setShowComparisonModal(true);
    } else {
      // Reset for next round
      setCurrentComparisonPair(0);
    }
  };

  const handleCloseModal = () => {
    setShowComparisonModal(false);
  };

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

  const currentPair = comparisonPairs[currentComparisonPair];

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
              <TouchableOpacity 
                key={index} 
                style={styles.videoCard}
                onPress={() => handleVideoClick(video.id)}
                activeOpacity={0.8}
              >
                <View style={styles.videoThumbnail}>
                  <Text style={styles.videoPlaceholder}>Video</Text>
                  {clickedVideos.includes(video.id) && (
                    <View style={styles.clickedBadge}>
                      <IconSymbol
                        android_material_icon_name="check-circle"
                        ios_icon_name="checkmark.circle.fill"
                        size={24}
                        color={colors.accent}
                      />
                    </View>
                  )}
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
              </TouchableOpacity>
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

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText2}>
            💡 Tap on videos to watch them! After viewing 1-2 videos, you&apos;ll be asked to compare more videos.
          </Text>
        </View>
      </ScrollView>

      {/* Video Comparison Modal */}
      <VideoComparisonModal
        visible={showComparisonModal}
        onClose={handleCloseModal}
        onVote={handleComparisonVote}
        video1={currentPair.video1}
        video2={currentPair.video2}
      />
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
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  clickedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 4,
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
    marginBottom: 16,
  },
  communityButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
  },
  infoText2: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
