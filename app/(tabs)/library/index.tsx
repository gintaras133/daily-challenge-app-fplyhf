
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

interface UserVideo {
  id: string;
  title: string;
  task: string;
  uploaded_at: string;
  views: number;
  likes: number;
  video_url: string;
}

export default function LibraryScreen() {
  const { userProfile } = useAuth();
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserVideos = async () => {
    try {
      if (!userProfile?.id) {
        console.log('No user profile found');
        return;
      }

      const { data, error } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching user videos:', error);
        throw error;
      }

      console.log('Fetched user videos:', data);
      setUserVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserVideos();
  }, [userProfile?.id]);

  // Refresh videos when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserVideos();
    }, [userProfile?.id])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserVideos();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // User stats
  const userStats = {
    videoCount: userVideos.length,
    winsCount: 0,
    streakNumber: 0,
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

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol 
              android_material_icon_name="video-library"
              size={28} 
              color={colors.accent}
            />
            <Text style={styles.statValue}>{userStats.videoCount}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol 
              android_material_icon_name="emoji-events"
              size={28} 
              color="#FFD700"
            />
            <Text style={styles.statValue}>{userStats.winsCount}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol 
              android_material_icon_name="local-fire-department"
              size={28} 
              color="#FF6B6B"
            />
            <Text style={styles.statValue}>{userStats.streakNumber}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* My Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Videos</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading your videos...</Text>
            </View>
          ) : userVideos.length > 0 ? (
            userVideos.map((video, index) => (
              <View key={index} style={styles.videoCard}>
                <View style={styles.videoThumbnail}>
                  <Text style={styles.videoPlaceholder}>Video</Text>
                  <View style={styles.playIconOverlay}>
                    <IconSymbol 
                      android_material_icon_name="play-circle"
                      size={48} 
                      color="rgba(255, 255, 255, 0.9)"
                    />
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoTask}>{video.task}</Text>
                  <View style={styles.videoStats}>
                    <View style={styles.videoStatItem}>
                      <IconSymbol 
                        android_material_icon_name="visibility"
                        size={14} 
                        color={colors.text}
                      />
                      <Text style={styles.videoStatText}>{video.views}</Text>
                    </View>
                    <View style={styles.videoStatItem}>
                      <IconSymbol 
                        android_material_icon_name="favorite"
                        size={14} 
                        color={colors.accent}
                      />
                      <Text style={styles.videoStatText}>{video.likes}</Text>
                    </View>
                    <Text style={styles.videoDate}>{formatDate(video.uploaded_at)}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol 
                android_material_icon_name="videocam-off"
                size={48} 
                color={colors.text}
              />
              <Text style={styles.emptyStateText}>
                No videos yet. Start participating in challenges!
              </Text>
              <TouchableOpacity
                style={styles.recordButton}
                onPress={() => router.push('/(tabs)/(home)/record')}
              >
                <Text style={styles.recordButtonText}>Record Your First Video</Text>
              </TouchableOpacity>
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textHeader,
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  videoThumbnail: {
    width: 120,
    height: 160,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  playIconOverlay: {
    position: 'absolute',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  videoTask: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoStatText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  videoDate: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.7,
  },
  emptyState: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  recordButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  recordButtonText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  communityButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 100,
  },
  communityButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
