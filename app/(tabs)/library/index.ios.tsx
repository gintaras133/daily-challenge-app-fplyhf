
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import VideoPreview from '@/components/VideoPreview';
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
  const { userProfile, user } = useAuth();
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserVideos = async () => {
    try {
      console.log('=== Fetching user videos ===');
      console.log('User profile ID:', userProfile?.id);
      console.log('Auth user ID:', user?.id);
      
      // Use auth user ID as primary, fallback to profile ID
      const userId = user?.id || userProfile?.id;
      
      if (!userId) {
        console.log('No user ID found - user not authenticated');
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      console.log('Querying videos for user ID:', userId);

      const { data, error } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching user videos:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('Fetched user videos count:', data?.length || 0);
      console.log('Video data:', JSON.stringify(data, null, 2));
      setUserVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Library screen mounted, user profile:', userProfile?.id, 'auth user:', user?.id);
    if (user?.id || userProfile?.id) {
      fetchUserVideos();
    } else {
      setIsLoading(false);
    }
  }, [userProfile?.id, user?.id]);

  // Refresh videos when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Library screen focused, refreshing videos');
      if (user?.id || userProfile?.id) {
        fetchUserVideos();
      }
    }, [userProfile?.id, user?.id])
  );

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
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
              ios_icon_name="gearshape.fill"
              android_material_icon_name="settings" 
              size={24} 
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
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
              ios_icon_name="play.rectangle.fill"
              size={28} 
              color={colors.accent}
            />
            <Text style={styles.statValue}>{userStats.videoCount}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="trophy.fill"
              size={28} 
              color="#FFD700"
            />
            <Text style={styles.statValue}>{userStats.winsCount}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol 
              ios_icon_name="flame.fill"
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
                <VideoPreview
                  videoUrl={video.video_url}
                  width={120}
                  height={160}
                  borderRadius={12}
                  showPlayButton={true}
                  autoPlay={false}
                  muted={true}
                />
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoTask}>{video.task}</Text>
                  <View style={styles.videoStats}>
                    <View style={styles.videoStatItem}>
                      <IconSymbol 
                        ios_icon_name="eye.fill"
                        size={14} 
                        color={colors.text}
                      />
                      <Text style={styles.videoStatText}>{video.views}</Text>
                    </View>
                    <View style={styles.videoStatItem}>
                      <IconSymbol 
                        ios_icon_name="heart.fill"
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
                ios_icon_name="video.slash"
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
    paddingTop: 60,
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
