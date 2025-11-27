
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import VideoComparisonModal from '@/components/VideoComparisonModal';
import { 
  getTopSafePadding, 
  getBottomSafePadding, 
  getHorizontalPadding,
  getSpacing,
  getBorderRadius,
  getFontSizes,
  getIconSize,
  getCardPadding,
  getAvatarSize,
} from '@/utils/responsive';

interface FriendVideo {
  id: string;
  username: string;
  timeAgo: string;
  likes: number;
  views: number;
  avatarUrl: string;
}

export default function CommunityScreen() {
  const [clickedVideos, setClickedVideos] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [currentComparisonPair, setCurrentComparisonPair] = useState<number>(0);

  // Get responsive values
  const fontSizes = getFontSizes();
  const topPadding = getTopSafePadding();
  const bottomPadding = getBottomSafePadding();
  const horizontalPadding = getHorizontalPadding();
  const spacing = getSpacing();
  const cardPadding = getCardPadding();
  const avatarSize = getAvatarSize('small');

  const friendsVideos: FriendVideo[] = [
    {
      id: '1',
      username: '@sarah_adventures',
      timeAgo: '2h ago',
      likes: 234,
      views: 1240,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
      id: '2',
      username: '@mike_creates',
      timeAgo: '3h ago',
      likes: 567,
      views: 2130,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    {
      id: '3',
      username: '@emma_vibes',
      timeAgo: '4h ago',
      likes: 891,
      views: 3450,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    {
      id: '4',
      username: '@alex_creative',
      timeAgo: '5h ago',
      likes: 432,
      views: 1890,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    },
  ];

  // Additional video pairs for the comparison modal
  const comparisonPairs = [
    {
      video1: {
        id: '5',
        username: '@lisa_films',
        avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      },
      video2: {
        id: '6',
        username: '@john_edits',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
      },
    },
    {
      video1: {
        id: '7',
        username: '@kate_creates',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      },
      video2: {
        id: '8',
        username: '@tom_films',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      },
    },
  ];

  const communityStats = {
    friendsActive: 24,
    totalVideos: 156,
    timeLeft: '8h',
  };

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId);
    
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

  const handleLoadMore = () => {
    console.log('Load more friends videos');
  };

  const handleAdDemoPress = () => {
    console.log('Navigating to Ad Demo');
    router.push('/(tabs)/community/ad-demo');
  };

  const currentPair = comparisonPairs[currentComparisonPair];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding,
            paddingHorizontal: horizontalPadding,
            paddingBottom: bottomPadding,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: spacing * 3 }]}>
          <View style={[styles.headerIcon, { marginBottom: spacing * 0.5 }]}>
            <IconSymbol android_material_icon_name="people" size={getIconSize('large')} color={colors.text} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: fontSizes.title, marginBottom: spacing * 2 }]}>
            COMMUNITY HUB
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: fontSizes.medium }]}>
            See what your friends created today!
          </Text>
        </View>

        {/* Ad Demo Button */}
        <TouchableOpacity 
          style={[
            styles.adDemoButton,
            {
              paddingVertical: spacing * 1.5,
              borderRadius: getBorderRadius('large'),
              marginBottom: spacing * 3,
            }
          ]}
          onPress={handleAdDemoPress}
        >
          <IconSymbol 
            android_material_icon_name="ad-units" 
            size={getIconSize('medium')} 
            color={colors.text}
          />
          <Text style={[styles.adDemoText, { fontSize: fontSizes.medium }]}>
            View Responsive Ad Demo
          </Text>
        </TouchableOpacity>

        {/* Friends' Today Videos Section */}
        <Text style={[styles.sectionTitle, { fontSize: fontSizes.large, marginBottom: spacing * 2 }]}>
          Friends&apos; Today Videos
        </Text>

        {/* Video Cards */}
        {friendsVideos.map((video, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.videoCard,
              {
                borderRadius: getBorderRadius('large'),
                padding: cardPadding,
                marginBottom: spacing * 2,
              }
            ]}
            onPress={() => handleVideoClick(video.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.videoThumbnail,
              {
                borderRadius: getBorderRadius('medium'),
                marginBottom: spacing,
              }
            ]}>
              <Text style={[styles.videoPlaceholder, { fontSize: fontSizes.medium }]}>Video</Text>
              {clickedVideos.includes(video.id) && (
                <View style={styles.clickedBadge}>
                  <IconSymbol
                    android_material_icon_name="check-circle"
                    ios_icon_name="checkmark.circle.fill"
                    size={getIconSize('medium')}
                    color={colors.accent}
                  />
                </View>
              )}
            </View>

            <View style={[styles.videoInfo, { gap: spacing }]}>
              <View style={[styles.videoHeader, { gap: spacing }]}>
                <Image 
                  source={{ uri: video.avatarUrl }} 
                  style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
                />
                <View style={styles.userDetails}>
                  <Text style={[styles.username, { fontSize: fontSizes.medium, marginBottom: 2 }]}>
                    {video.username}
                  </Text>
                  <Text style={[styles.timeAgo, { fontSize: fontSizes.small }]}>
                    {video.timeAgo}
                  </Text>
                </View>
              </View>

              <Text style={[styles.videoDescription, { fontSize: fontSizes.body, lineHeight: fontSizes.body * 1.5 }]}>
                Nailed the CapCut challenge! 🎯{'\n'}#BubblesBubbles
              </Text>

              <View style={[styles.videoStats, { gap: spacing * 2 }]}>
                <View style={[styles.statItem, { gap: spacing * 0.5 }]}>
                  <IconSymbol android_material_icon_name="favorite" size={getIconSize('small')} color={colors.accent} />
                  <Text style={[styles.statText, { fontSize: fontSizes.body }]}>{video.likes}</Text>
                </View>
                <View style={[styles.statItem, { gap: spacing * 0.5 }]}>
                  <IconSymbol android_material_icon_name="visibility" size={getIconSize('small')} color={colors.text} />
                  <Text style={[styles.statText, { fontSize: fontSizes.body }]}>{video.views}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        <TouchableOpacity 
          style={[
            styles.loadMoreButton,
            {
              paddingVertical: spacing * 2,
              borderRadius: getBorderRadius('large'),
              marginBottom: spacing * 2,
            }
          ]} 
          onPress={handleLoadMore}
        >
          <Text style={[styles.loadMoreText, { fontSize: fontSizes.medium }]}>Load More Friends</Text>
        </TouchableOpacity>

        {/* Community Stats */}
        <View style={[styles.statsContainer, { gap: spacing, marginBottom: spacing * 2 }]}>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding }]}>
            <Text style={[styles.statNumber, { fontSize: fontSizes.title, marginBottom: spacing * 0.5 }]}>
              {communityStats.friendsActive}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Friends Active</Text>
          </View>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding }]}>
            <Text style={[styles.statNumber, { fontSize: fontSizes.title, marginBottom: spacing * 0.5 }]}>
              {communityStats.totalVideos}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Total Videos</Text>
          </View>
          <View style={[styles.statCard, { borderRadius: getBorderRadius('medium'), padding: cardPadding }]}>
            <Text style={[styles.statNumber, { fontSize: fontSizes.title, marginBottom: spacing * 0.5 }]}>
              {communityStats.timeLeft}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSizes.small }]}>Left Today</Text>
          </View>
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
    backgroundColor: colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Dynamic padding applied inline
  },
  header: {
    alignItems: 'center',
  },
  headerIcon: {
    // Dynamic margin applied inline
  },
  headerTitle: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: colors.text,
    fontWeight: '500',
  },
  adDemoButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  adDemoText: {
    color: colors.text,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  videoCard: {
    backgroundColor: colors.primary,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
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
    // Dynamic gap applied inline
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.secondary,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontWeight: '600',
  },
  timeAgo: {
    color: colors.text,
    fontWeight: '400',
  },
  videoDescription: {
    color: colors.text,
    fontWeight: '500',
  },
  videoStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: colors.text,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  loadMoreText: {
    color: colors.text,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});
