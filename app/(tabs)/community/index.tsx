
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import VideoComparisonModal from '@/components/VideoComparisonModal';

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

  const currentPair = comparisonPairs[currentComparisonPair];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconSymbol android_material_icon_name="people" size={28} color={colors.text} />
          </View>
          <Text style={styles.headerTitle}>COMMUNITY HUB</Text>
          <Text style={styles.headerSubtitle}>See what your friends created today!</Text>
        </View>

        {/* Friends' Today Videos Section */}
        <Text style={styles.sectionTitle}>Friends&apos; Today Videos</Text>

        {/* Video Cards */}
        {friendsVideos.map((video, index) => (
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
              <View style={styles.videoHeader}>
                <Image 
                  source={{ uri: video.avatarUrl }} 
                  style={styles.avatar}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.username}>{video.username}</Text>
                  <Text style={styles.timeAgo}>{video.timeAgo}</Text>
                </View>
              </View>

              <Text style={styles.videoDescription}>
                Nailed the CapCut challenge! 🎯{'\n'}#BubblesBubbles
              </Text>

              <View style={styles.videoStats}>
                <View style={styles.statItem}>
                  <IconSymbol android_material_icon_name="favorite" size={16} color={colors.accent} />
                  <Text style={styles.statText}>{video.likes}</Text>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol android_material_icon_name="visibility" size={16} color={colors.text} />
                  <Text style={styles.statText}>{video.views}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Load More Friends</Text>
        </TouchableOpacity>

        {/* Community Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.friendsActive}</Text>
            <Text style={styles.statLabel}>Friends Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.totalVideos}</Text>
            <Text style={styles.statLabel}>Total Videos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.timeLeft}</Text>
            <Text style={styles.statLabel}>Left Today</Text>
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
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  headerSubtitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  videoCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 16,
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
    gap: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '400',
  },
  videoDescription: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  videoStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadMoreText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
