
import React, { useState, useEffect, useCallback } from 'react';
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
import VideoPlayerModal from '@/components/VideoPlayerModal';
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

interface UserStats {
  videoCount: number;
  winsCount: number;
  streakNumber: number;
  bloopCoins: number;
}

// Predefined challenge names for the last 3 videos
const CHALLENGE_NAMES = [
  'Film something that represents your "inner child."',
  'Show a hobby you never post about.',
  'Film yourself saying one sentence you wish someone told you today.',
];

// Function to generate random views and likes
const generateRandomStats = () => ({
  views: Math.floor(Math.random() * 1000) + 100, // Random views between 100-1100
  likes: Math.floor(Math.random() * 200) + 20,   // Random likes between 20-220
});

export default function LibraryScreen() {
  const { userProfile, user } = useAuth();
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    videoCount: 0,
    winsCount: 0,
    streakNumber: 0,
    bloopCoins: 0,
  });

  const fetchUserData = useCallback(async () => {
    try {
      console.log('=== FETCHING USER DATA (iOS) ===');
      console.log('User profile ID:', userProfile?.id);
      console.log('Auth user ID:', user?.id);
      
      // Use auth user ID as primary, fallback to profile ID
      const userId = user?.id || userProfile?.id;
      
      if (!userId) {
        console.log('❌ No user ID found - user not authenticated');
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      console.log('✅ Querying data for user ID:', userId);

      // Fetch user profile for wins, streaks, and bloop coins
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('wins, streak, bloop_coins')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
      } else {
        console.log('✅ Profile data:', profileData);
      }

      // Fetch user videos
      console.log('📹 Fetching user videos...');
      const { data: videosData, error: videosError } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (videosError) {
        console.error('❌ Error fetching user videos:', videosError);
        console.error('Error details:', JSON.stringify(videosError, null, 2));
        throw videosError;
      }

      console.log('✅ Fetched', videosData?.length || 0, 'videos');
      
      // Process videos: replace last 3 with new challenge names and add random stats
      let processedVideos = videosData || [];
      
      if (processedVideos.length > 0) {
        processedVideos = processedVideos.map((video, index) => {
          // Add random views and likes to the first video (today's challenge)
          if (index === 0) {
            const randomStats = generateRandomStats();
            return {
              ...video,
              views: randomStats.views,
              likes: randomStats.likes,
            };
          }
          
          // Replace last 3 videos with new challenge names
          const lastThreeIndex = processedVideos.length - 3;
          if (index >= lastThreeIndex && index < processedVideos.length) {
            const challengeIndex = index - lastThreeIndex;
            const randomStats = generateRandomStats();
            return {
              ...video,
              title: CHALLENGE_NAMES[challengeIndex],
              task: CHALLENGE_NAMES[challengeIndex],
              views: randomStats.views,
              likes: randomStats.likes,
            };
          }
          
          // Add random stats to other videos
          const randomStats = generateRandomStats();
          return {
            ...video,
            views: randomStats.views,
            likes: randomStats.likes,
          };
        });
      }
      
      // Log each video URL for debugging
      if (processedVideos && processedVideos.length > 0) {
        console.log('=== VIDEO DETAILS ===');
        processedVideos.forEach((video, index) => {
          console.log(`Video ${index + 1}:`);
          console.log('  - Title:', video.title);
          console.log('  - URL:', video.video_url);
          console.log('  - Uploaded:', video.uploaded_at);
          console.log('  - Views:', video.views, '| Likes:', video.likes);
        });
      } else {
        console.log('ℹ️ No videos found for this user');
      }
      
      setUserVideos(processedVideos);

      // Update stats
      setUserStats({
        videoCount: processedVideos?.length || 0,
        winsCount: profileData?.wins || 0,
        streakNumber: profileData?.streak || 0,
        bloopCoins: profileData?.bloop_coins || 0,
      });

      console.log('=== DATA FETCH COMPLETE ===');

    } catch (error) {
      console.error('❌ Error loading user data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, userProfile?.id]);

  useEffect(() => {
    console.log('📱 Library screen mounted (iOS)');
    if (user?.id || userProfile?.id) {
      fetchUserData();
    } else {
      console.log('⚠️ No user authenticated');
      setIsLoading(false);
    }
  }, [userProfile?.id, user?.id, fetchUserData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Library screen focused, refreshing data (iOS)');
      if (user?.id || userProfile?.id) {
        fetchUserData();
      }
    }, [userProfile?.id, user?.id, fetchUserData])
  );

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered (iOS)');
    setIsRefreshing(true);
    fetchUserData();
  };

  const handleVideoPress = (video: UserVideo) => {
    console.log('👆 Video pressed:', video.title);
    console.log('Opening video URL:', video.video_url);
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    console.log('❌ Closing video modal');
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedVideo(null);
    }, 300);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Library</Text>
          <View style={styles.headerRight}>
            <View style={styles.coinsContainer}>
              <IconSymbol 
                ios_icon_name="bitcoinsign.circle.fill"
                android_material_icon_name="monetization-on" 
                size={20} 
                color="#FFD700"
              />
              <Text style={styles.coinsText}>{userStats.bloopCoins}</Text>
            </View>
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
            <View style={styles.videosGrid}>
              {userVideos.map((video, index) => (
                <TouchableOpacity
                  key={video.id || index}
                  style={styles.videoCard}
                  onPress={() => handleVideoPress(video)}
                  activeOpacity={0.7}
                >
                  <View style={styles.videoPreviewContainer}>
                    <VideoPreview
                      videoUrl={video.video_url}
                      width={100}
                      height={140}
                      borderRadius={12}
                      showPlayButton={true}
                      autoPlay={false}
                      muted={true}
                      onPress={() => handleVideoPress(video)}
                    />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoTask} numberOfLines={2}>
                      {video.task}
                    </Text>
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
                </TouchableOpacity>
              ))}
            </View>
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

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          visible={isModalVisible}
          videoUrl={selectedVideo.video_url}
          videoTitle={selectedVideo.title}
          videoTask={selectedVideo.task}
          onClose={handleCloseModal}
        />
      )}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  coinsText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
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
  videosGrid: {
    gap: 16,
  },
  videoCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  videoPreviewContainer: {
    flexShrink: 0,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  videoTask: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 12,
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
