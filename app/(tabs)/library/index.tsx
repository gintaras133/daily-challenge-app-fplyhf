
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
import VideoPreview from '@/components/VideoPreview';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import { supabase } from '@/app/integrations/supabase/client';
import { 
  getTopSafePadding, 
  getBottomSafePadding, 
  getHorizontalPadding,
  getSpacing,
  getBorderRadius,
  getFontSizes,
  getIconSize,
  getCardPadding,
} from '@/utils/responsive';

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

  // Get responsive values
  const fontSizes = getFontSizes();
  const topPadding = getTopSafePadding();
  const bottomPadding = getBottomSafePadding();
  const horizontalPadding = getHorizontalPadding();
  const spacing = getSpacing();
  const cardPadding = getCardPadding();

  const fetchUserData = async () => {
    try {
      console.log('=== FETCHING USER DATA ===');
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
      
      // Log each video URL for debugging
      if (videosData && videosData.length > 0) {
        console.log('=== VIDEO DETAILS ===');
        videosData.forEach((video, index) => {
          console.log(`Video ${index + 1}:`);
          console.log('  - Title:', video.title);
          console.log('  - URL:', video.video_url);
          console.log('  - Uploaded:', video.uploaded_at);
          console.log('  - Views:', video.views, '| Likes:', video.likes);
        });
      } else {
        console.log('ℹ️ No videos found for this user');
      }
      
      setUserVideos(videosData || []);

      // Update stats
      setUserStats({
        videoCount: videosData?.length || 0,
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
  };

  useEffect(() => {
    console.log('📱 Library screen mounted');
    if (user?.id || userProfile?.id) {
      fetchUserData();
    } else {
      console.log('⚠️ No user authenticated');
      setIsLoading(false);
    }
  }, [userProfile?.id, user?.id]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Library screen focused, refreshing data');
      if (user?.id || userProfile?.id) {
        fetchUserData();
      }
    }, [userProfile?.id, user?.id])
  );

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
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
      <View style={[
        styles.header,
        {
          paddingTop: topPadding,
          paddingHorizontal: horizontalPadding,
          paddingBottom: spacing * 2,
        }
      ]}>
        <View style={[styles.headerTop, { marginBottom: spacing }]}>
          <Text style={[styles.title, { fontSize: fontSizes.hero }]}>Library</Text>
          <View style={styles.headerRight}>
            <View style={[
              styles.coinsContainer,
              {
                borderRadius: getBorderRadius('large'),
                paddingVertical: spacing * 0.75,
                paddingHorizontal: spacing * 1.5,
                marginRight: spacing,
              }
            ]}>
              <IconSymbol 
                android_material_icon_name="monetization-on" 
                size={getIconSize('small')} 
                color="#FFD700"
              />
              <Text style={[styles.coinsText, { fontSize: fontSizes.medium, marginLeft: spacing * 0.5 }]}>
                {userStats.bloopCoins}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingsButton,
                {
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                }
              ]}
              onPress={() => router.push('/(tabs)/library/profile')}
            >
              <IconSymbol 
                android_material_icon_name="settings" 
                size={getIconSize('medium')} 
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{
          padding: horizontalPadding,
          paddingBottom: bottomPadding,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Stats Cards */}
        <View style={[styles.statsContainer, { marginBottom: spacing * 2, gap: spacing }]}>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding, gap: spacing }]}>
            <IconSymbol 
              android_material_icon_name="video-library"
              size={getIconSize('large')} 
              color={colors.accent}
            />
            <Text style={[styles.statValue, { fontSize: fontSizes.title }]}>{userStats.videoCount}</Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Videos</Text>
          </View>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding, gap: spacing }]}>
            <IconSymbol 
              android_material_icon_name="emoji-events"
              size={getIconSize('large')} 
              color="#FFD700"
            />
            <Text style={[styles.statValue, { fontSize: fontSizes.title }]}>{userStats.winsCount}</Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Wins</Text>
          </View>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding, gap: spacing }]}>
            <IconSymbol 
              android_material_icon_name="local-fire-department"
              size={getIconSize('large')} 
              color="#FF6B6B"
            />
            <Text style={[styles.statValue, { fontSize: fontSizes.title }]}>{userStats.streakNumber}</Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Streak</Text>
          </View>
        </View>

        {/* My Videos Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSizes.xxlarge, marginBottom: spacing * 2 }]}>
            My Videos
          </Text>
          
          {isLoading ? (
            <View style={[
              styles.loadingContainer,
              {
                borderRadius: getBorderRadius('medium'),
                padding: spacing * 4,
                gap: spacing * 2,
              }
            ]}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { fontSize: fontSizes.medium }]}>Loading your videos...</Text>
            </View>
          ) : userVideos.length > 0 ? (
            <View style={[styles.videosGrid, { gap: spacing * 2 }]}>
              {userVideos.map((video, index) => (
                <TouchableOpacity
                  key={video.id || index}
                  style={[
                    styles.videoCard,
                    {
                      borderRadius: getBorderRadius('medium'),
                      padding: cardPadding,
                      gap: spacing * 1.5,
                    }
                  ]}
                  onPress={() => handleVideoPress(video)}
                  activeOpacity={0.7}
                >
                  <View style={styles.videoPreviewContainer}>
                    <VideoPreview
                      videoUrl={video.video_url}
                      width={100}
                      height={140}
                      borderRadius={getBorderRadius('small')}
                      showPlayButton={true}
                      autoPlay={false}
                      muted={true}
                      onPress={() => handleVideoPress(video)}
                    />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text 
                      style={[styles.videoTitle, { fontSize: fontSizes.medium, marginBottom: spacing * 0.5 }]}
                      numberOfLines={2}
                    >
                      {video.title}
                    </Text>
                    <Text 
                      style={[styles.videoTask, { fontSize: fontSizes.body, marginBottom: spacing }]}
                      numberOfLines={2}
                    >
                      {video.task}
                    </Text>
                    <View style={[styles.videoStats, { gap: spacing }]}>
                      <View style={[styles.videoStatItem, { gap: spacing * 0.5 }]}>
                        <IconSymbol 
                          android_material_icon_name="visibility"
                          size={getIconSize('small')} 
                          color={colors.text}
                        />
                        <Text style={[styles.videoStatText, { fontSize: fontSizes.small }]}>{video.views}</Text>
                      </View>
                      <View style={[styles.videoStatItem, { gap: spacing * 0.5 }]}>
                        <IconSymbol 
                          android_material_icon_name="favorite"
                          size={getIconSize('small')} 
                          color={colors.accent}
                        />
                        <Text style={[styles.videoStatText, { fontSize: fontSizes.small }]}>{video.likes}</Text>
                      </View>
                      <Text style={[styles.videoDate, { fontSize: fontSizes.tiny }]}>
                        {formatDate(video.uploaded_at)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[
              styles.emptyState,
              {
                borderRadius: getBorderRadius('medium'),
                padding: spacing * 4,
                gap: spacing * 2,
              }
            ]}>
              <IconSymbol 
                android_material_icon_name="videocam-off"
                size={48} 
                color={colors.text}
              />
              <Text style={[styles.emptyStateText, { fontSize: fontSizes.medium, lineHeight: fontSizes.medium * 1.5 }]}>
                No videos yet. Start participating in challenges!
              </Text>
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  {
                    borderRadius: getBorderRadius('medium'),
                    paddingVertical: spacing,
                    paddingHorizontal: spacing * 2,
                    marginTop: spacing,
                  }
                ]}
                onPress={() => router.push('/(tabs)/(home)/record')}
              >
                <Text style={[styles.recordButtonText, { fontSize: fontSizes.medium }]}>
                  Record Your First Video
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.communityButton,
            {
              borderRadius: getBorderRadius('medium'),
              padding: cardPadding,
              marginTop: spacing * 2,
              marginBottom: spacing * 10,
            }
          ]}
          onPress={() => router.push('/(tabs)/community')}
        >
          <Text style={[styles.communityButtonText, { fontSize: fontSizes.medium }]}>
            Back to Community Hub
          </Text>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsContainer: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  settingsButton: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  section: {
    // No inline styles needed
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  loadingContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    textAlign: 'center',
  },
  videosGrid: {
    // Gap is set inline
  },
  videoCard: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
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
    fontWeight: '700',
  },
  videoTask: {
    color: colors.text,
    fontWeight: '500',
    opacity: 0.8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoStatText: {
    color: colors.text,
    fontWeight: '600',
  },
  videoDate: {
    color: colors.text,
    fontWeight: '400',
    opacity: 0.7,
  },
  emptyState: {
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.text,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: colors.accent,
  },
  recordButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  communityButton: {
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  communityButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});
