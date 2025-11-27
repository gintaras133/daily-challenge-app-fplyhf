
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface FriendVideo {
  id: string;
  username: string;
  timeAgo: string;
  likes: number;
  views: number;
  avatarColor: string;
}

export default function CommunityScreen() {
  const friendsVideos: FriendVideo[] = [
    {
      id: '1',
      username: '@sarah_adventures',
      timeAgo: '2h ago',
      likes: 234,
      views: 1240,
      avatarColor: colors.primary,
    },
    {
      id: '2',
      username: '@mike_creates',
      timeAgo: '3h ago',
      likes: 567,
      views: 2130,
      avatarColor: colors.secondary,
    },
    {
      id: '3',
      username: '@emma_vibes',
      timeAgo: '4h ago',
      likes: 891,
      views: 3450,
      avatarColor: colors.accent,
    },
    {
      id: '4',
      username: '@alex_creative',
      timeAgo: '5h ago',
      likes: 432,
      views: 1890,
      avatarColor: colors.primary,
    },
  ];

  const communityStats = {
    friendsActive: 24,
    totalVideos: 156,
    timeLeft: '8h',
  };

  const handleLoadMore = () => {
    console.log('Load more friends videos');
  };

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
          <View key={index} style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Text style={styles.videoPlaceholder}>Video</Text>
            </View>

            <View style={styles.videoInfo}>
              <View style={styles.videoHeader}>
                <View style={[styles.avatar, { backgroundColor: video.avatarColor }]} />
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
          </View>
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
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
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
