
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

export default function LibraryScreen() {
  const { userProfile } = useAuth();
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get responsive values
  const fontSizes = getFontSizes();
  const topPadding = getTopSafePadding();
  const bottomPadding = getBottomSafePadding();
  const horizontalPadding = getHorizontalPadding();
  const spacing = getSpacing();
  const cardPadding = getCardPadding();

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
        {userProfile && (
          <View style={[styles.profileInfo, { gap: spacing * 0.5 }]}>
            <Text style={[styles.welcomeText, { fontSize: fontSizes.medium, marginBottom: spacing * 0.5 }]}>
              Welcome, {userProfile.full_name}!
            </Text>
            <View style={[styles.infoRow, { gap: spacing * 0.5 }]}>
              <IconSymbol 
                android_material_icon_name="location-on" 
                size={getIconSize('small')} 
                color={colors.text}
              />
              <Text style={[styles.infoText, { fontSize: fontSizes.body }]}>{userProfile.country}</Text>
            </View>
            <View style={[styles.infoRow, { gap: spacing * 0.5 }]}>
              <IconSymbol 
                android_material_icon_name="phone" 
                size={getIconSize('small')} 
                color={colors.text}
              />
              <Text style={[styles.infoText, { fontSize: fontSizes.body }]}>
                {getPhoneWithoutCountryCode(userProfile.telephone_number)}
              </Text>
            </View>
          </View>
        )}
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
            userVideos.map((video, index) => (
              <View 
                key={index} 
                style={[
                  styles.videoCard,
                  {
                    borderRadius: getBorderRadius('medium'),
                    padding: cardPadding,
                    marginBottom: spacing * 2,
                    gap: spacing,
                  }
                ]}
              >
                <View style={[
                  styles.videoThumbnail,
                  {
                    borderRadius: getBorderRadius('medium'),
                  }
                ]}>
                  <Text style={[styles.videoPlaceholder, { fontSize: fontSizes.body }]}>Video</Text>
                  <View style={styles.playIconOverlay}>
                    <IconSymbol 
                      android_material_icon_name="play-circle"
                      size={48} 
                      color="rgba(255, 255, 255, 0.9)"
                    />
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={[styles.videoTitle, { fontSize: fontSizes.medium, marginBottom: spacing * 0.5 }]}>
                    {video.title}
                  </Text>
                  <Text style={[styles.videoTask, { fontSize: fontSizes.body, marginBottom: spacing }]}>
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
              </View>
            ))
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
  title: {
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  settingsButton: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    // Dynamic gap applied inline
  },
  welcomeText: {
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: colors.text,
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
  videoCard: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
  videoThumbnail: {
    width: 120,
    height: 160,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
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
